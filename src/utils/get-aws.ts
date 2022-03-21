import * as AWS from "aws-sdk";
import chalk from "chalk";
import { readJsonFile, writeJsonFile, getEnabledRegions, getCurrentIp } from "./utils";
import { IConfigData, IInstancesData, IAccountCredentials, IInstance } from "./interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";
import { Config } from "@oclif/core";

export default async function getAWS(flags: FlagInput<any>, config: Config): Promise<IInstancesData | undefined> {
  const configData: IConfigData = await readJsonFile(config.configDir, "config");

  if (!configData) {
    return;
  }

  const instancesData: IInstancesData = await readJsonFile(config.dataDir, "instances");

  if (!instancesData) {
    return;
  }

  const accountsToSearch: Array<IAccountCredentials> = flags.account.toString() === "all" ?
    configData.accountCredentials : configData.accountCredentials.filter((account: IAccountCredentials) => {
      return flags.account.toString().split(",").includes(account.awsAccountName);
    });

  if (JSON.parse(flags["no-refresh"].toString())) {
    const instances: IInstancesData = {
      aws: instancesData.aws.filter((instance: IInstance) => {
        return accountsToSearch.some((account: IAccountCredentials) => {
          return account.awsAccountName === instance.account;
        }) &&
          (flags.region.toString() === "all" ||
            flags.region.toString().includes(instance.location)) &&
          (flags.state.toString() === "all" ||
            flags.state.toString().split(",").includes(instance.state));
      }),
      gcp: [],
      self: []
    };

    return instances;
  }

  instancesData.aws = [];
  console.log(`${chalk.green("[INFO]")} Gathering AWS managed instances`);

  for await (const account of accountsToSearch) {
    console.log(`${chalk.green("[INFO]")} Checking account: ${account.awsAccountName}`);

    await checkRegions(account, flags, instancesData);
  }

  const writeResponse: boolean = await writeJsonFile(config.dataDir, "instances", JSON.stringify(instancesData));

  if (!writeResponse) {
    return;
  }

  return instancesData;
}

async function checkRegions(account: IAccountCredentials, flags: any, instancesData: any): Promise<void> {
  const regionsToSearch: Array<string> = flags.region.toString() === "all" ?
    await getEnabledRegions(account) : flags.region.toString().split(",");

  for await (const region of regionsToSearch) {
    console.log(`${chalk.green("[INFO]")} Checking region: ${region}`);

    let roleCredentials: AWS.STS.AssumeRoleResponse | undefined;

    if (account.awsRole) {
      const stsParams: AWS.STS.AssumeRoleRequest = {
        RoleArn: account.awsRole,
        RoleSessionName: "serverx"
      };

      const creds = new AWS.EnvironmentCredentials("AWS");

      const sts: AWS.STS = new AWS.STS({
        credentials: creds,
        region: region
      });

      try {
        roleCredentials = await sts.assumeRole(stsParams).promise();
      } catch (error) {
        console.log(`${chalk.red("[ERROR]")} Unable to assume role: ${account.awsRole}`);
        console.log(`${chalk.red("[REASON]")} ${error}`);
        return;
      }
    }

    const awsInstances = await getInstances(region, account, roleCredentials, flags);
    instancesData.aws = [...instancesData.aws, ...awsInstances];
  }

  return instancesData;
}

async function getInstances(region: string, account: IAccountCredentials, roleCredentials: AWS.STS.AssumeRoleResponse | undefined, flags: FlagInput<any>): Promise<Array<IInstance>> {
  const instancesToReturn: Array<IInstance> = [];

  const describeInstancesParams: AWS.EC2.DescribeInstancesRequest = {
    Filters: [
      {
        Name: "instance-state-name",
        Values: flags.state.toString() === "all" ?
          ["pending", "running", "stopping", "shutting-down", "stopped", "terminated"] : flags.state.toString().split(",")
      }
    ]
  };

  const ec2: AWS.EC2 = roleCredentials ?
    new AWS.EC2({
      accessKeyId: roleCredentials.Credentials?.AccessKeyId,
      secretAccessKey: roleCredentials.Credentials?.SecretAccessKey,
      sessionToken: roleCredentials.Credentials?.SessionToken,
      region: region
    }) : new AWS.EC2({
      accessKeyId: account.awsAccessKey,
      secretAccessKey: account.awsSecretAccessKey,
      region: region
    });

  try {
    const describeInstancesResult: AWS.EC2.DescribeInstancesResult = await ec2.describeInstances(describeInstancesParams).promise();
    if (!describeInstancesResult.Reservations || describeInstancesResult.Reservations.length === 0) {
      return [];
    }

    for await (const reservation of describeInstancesResult.Reservations) {
      let name: string = "Unknown";
      let username: string = "Unknown";
      let accessible: boolean = false;

      if (!reservation.Instances || reservation.Instances.length === 0) {
        console.log(`${chalk.yellow("[WARN]")} No instances found in reservation: ${reservation.ReservationId}`);
        continue;
      }

      for await (const instance of reservation.Instances) {
        if (!instance.ImageId) {
          console.log(`${chalk.yellow("[WARN]")} No image found on instance: ${instance.InstanceId}`);
          continue;
        }

        const describeImagesParams: AWS.EC2.DescribeImagesRequest = {
          ImageIds: [
            instance.ImageId
          ]
        };

        const describeImagesResult: AWS.EC2.DescribeImagesResult = await ec2.describeImages(describeImagesParams).promise();

        if (describeImagesResult.Images && describeImagesResult.Images.length > 0) {
          if (describeImagesResult.Images[0].PlatformDetails?.includes("Linux")) {
            if (describeImagesResult.Images[0].ImageLocation?.includes("ubuntu")) {
              username = "ubuntu";
            } else if (describeImagesResult.Images[0].ImageLocation?.includes("CentOS")) {
              username = "centos";
            } else {
              username = "ec2-user";
            }
          } else {
            username = "Administrator";
          }
        }

        if (!instance.SecurityGroups || instance.SecurityGroups.length === 0) {
          continue;
        }

        for await (const securityGroup of instance.SecurityGroups) {
          if (!securityGroup.GroupId) {
            continue;
          }

          const instanceReachable: boolean = await getSecurityGroups(securityGroup.GroupId, ec2, instance);

          if (instanceReachable) {
            accessible = true;
          }
        }

        if (!instance.Tags || instance.Tags.length === 0) {
          continue;
        }

        try {
          name = instance.Tags[0].Value || "Unknown";
        } catch {
          name = "N/A";
        }

        instancesToReturn.push({
          name: name,
          address: instance.PublicIpAddress || "Unknown",
          keyPair: instance.KeyName || "Unknown",
          username: username || "Unknown",
          state: instance.State?.Name || "Unknown",
          accessible: accessible,
          location: region,
          account: account.awsAccountName
        });
      }
    }
  } catch {
    return [];
  }

  return instancesToReturn;
}

async function getSecurityGroups(securityGroupId: string, ec2: AWS.EC2, instance: AWS.EC2.Instance): Promise<boolean> {
  let accessible: boolean = false;

  const describeSecurityGroupsParams: AWS.EC2.DescribeSecurityGroupsRequest = {
    GroupIds: [
      securityGroupId
    ]
  };

  try {
    const describeSecurityGroupsResponse: AWS.EC2.DescribeSecurityGroupsResult = await ec2.describeSecurityGroups(describeSecurityGroupsParams).promise();

    if (!describeSecurityGroupsResponse.SecurityGroups || describeSecurityGroupsResponse.SecurityGroups.length === 0) {
      return false;
    }

    if (!describeSecurityGroupsResponse.SecurityGroups[0].IpPermissions || describeSecurityGroupsResponse.SecurityGroups[0].IpPermissions.length === 0) {
      return false;
    }

    for await (const ipPermission of describeSecurityGroupsResponse.SecurityGroups[0].IpPermissions) {
      if (!ipPermission.IpProtocol || ipPermission.IpProtocol.length === 0) {
        return false;
      }

      if (ipPermission.IpProtocol === "-1" || (ipPermission.FromPort && ipPermission.FromPort <= 22) || (ipPermission.ToPort && ipPermission.ToPort <= 22)) {
        if (!ipPermission.IpRanges || ipPermission.IpRanges.length === 0) {
          return false;
        }

        const currentIp: string | undefined = await getCurrentIp();

        if (!currentIp) {
          return false;
        }

        for await (const ipRange of ipPermission.IpRanges) {
          if (ipRange.CidrIp === currentIp + "/32" || ipRange.CidrIp === "0.0.0.0/0") {
            accessible = instance.State?.Name === "running";
          }
        }
      }
    }
  } catch (error: any) {
    return error;
  }

  return accessible;
}
