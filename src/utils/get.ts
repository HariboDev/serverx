import * as AWS from "aws-sdk";
const fs = require("fs");
const path = require("path");
import axios from "axios";
import chalk from "chalk";
import { isPortReachable } from "./utils";
import { IConfigData } from "../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";
import { Config } from "@oclif/core";

export default async function get(flags: FlagInput<any>, config: Config): Promise<any> {
  const instancesData = {
    awsManaged: [] as any,
    selfManaged: [] as any
  };
  let configData: IConfigData;

  try {
    configData = JSON.parse(fs.readFileSync(path.join(config.configDir, "config.json")));
    console.log(`${chalk.green("[INFO]")} Config file located`);
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to locate config file`);
    return Promise.reject(error);
  }

  let selfManagedInstances = [];

  try {
    selfManagedInstances = JSON.parse(fs.readFileSync(path.join(config.dataDir, "instances.json"))).selfManaged || [];
    console.log(`${chalk.green("[INFO]")} Data file located`);
  } catch {
    selfManagedInstances = [];
    console.log(`${chalk.red("[ERROR]")} Unable to locate data file`);
  }

  let regionFlag;
  if (("accountCredentials" in configData)) {
    flags.region.toString() === "all" ?
      regionFlag = ["us-east-1",
        "us-east-2",
        "us-west-1",
        "us-west-2",
        "ap-south-1",
        "ap-northeast-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "ca-central-1",
        "eu-central-1",
        "eu-west-1",
        "eu-west-2",
        "eu-west-3",
        "eu-north-1",
        "sa-east-1"] :
      regionFlag = flags.region.toString().split(",");

    if (flags.managed.toString() === "all" || flags.managed.toString().split(",").includes("aws")) {
      console.log(`${chalk.green("[INFO]")} Gathering AWS managed instances`);

      for await (const account of configData?.accountCredentials || []) {
        if (flags.account.toString() === "all") {
          console.log(`${chalk.green("[INFO]")} Checking account: ${account.awsAccountName}`);
        } else if (flags.account.toString().split(",").includes(account.awsAccountName)) {
          console.log(`${chalk.green("[INFO]")} Checking account: ${account.awsAccountName}`);
        } else {
          console.log(`${chalk.yellow("[INFO]")} Skipping account: ${account.awsAccountName}`);
          continue;
        }

        const test: any = await checkRegions(account, regionFlag, flags, instancesData);
        console.log(test);
      }
    }
  }

  if (selfManagedInstances.length > 0) {
    if (flags.managed.toString().split(",").includes("self") || flags.managed.toString().split(",").includes("all")) {
      console.log(`${chalk.green("[INFO]")} Gathering Self managed instances`);
    }

    for (const instance of selfManagedInstances) {
      const instanceData = {
        Name: instance.Name,
        Address: instance.Address,
        "Key Pair": instance["Key Pair"],
        Username: instance.Username,
        State: instance.State,
        Accessible: instance.State,
        Location: instance.Location,
        Account: instance.Account
      };

      isPortReachable(22, { host: instance.Address as string, timeout: 1000 })
        .then((accessible) => {
          instanceData.Accessible = accessible;
          return instanceData;
        });
      instancesData.selfManaged.push(instanceData);
    }
  }

  try {
    fs.writeFileSync(path.join(config.dataDir, "instances.json"), JSON.stringify(instancesData));
    console.log(`${chalk.green("[INFO]")} Instances gathered`);
    return instancesData;
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to save instance data locally`);
    return error;
  }
}

async function checkRegions(account: any, regionFlag: any, flags: any, instancesData: any): Promise<any> {
  let params = {};

  params = flags.state === "all" ? {
    Filters: [{
      Name: "instance-state-name",
      Values: ["pending", "running", "stopping", "shutting-down", "stopped", "terminated"]
    }]
  } : {
    Filters: [{
      Name: "instance-state-name",
      Values: flags.state
    }]
  };
  for await (const region of regionFlag) {
    console.log(`${chalk.green("[INFO]")} Checking region: ${region}`);
    let roleCredentials;
    if ("awsRole" in account) {
      const stsParams: AWS.STS.AssumeRoleRequest = {
        RoleArn: account.awsRole as string,
        RoleSessionName: "aws-ec2-profiles"
      };

      const creds = new AWS.EnvironmentCredentials("AWS");

      const sts: AWS.STS = new AWS.STS({
        credentials: creds,
        region: region
      });

      roleCredentials = sts.assumeRole(stsParams).promise()
        .then((data: AWS.STS.AssumeRoleResponse) => {
          return data;
        }).catch((error) => {
          console.log(`${chalk.red("[ERROR]")} Unable to assume role: ${account.awsRole}`);
          console.log(`${chalk.red("[REASON]")} ${error.message}`);
        });

      if (!roleCredentials) {
        console.log(`${chalk.red("ERROR")} Unable to get role credentials for ${region}`);
        continue;
      }
    }

    const instances = await getInstanceData(region, account, roleCredentials, params, instancesData);
    return instances;
  }
}

async function getInstanceData(region: any, account: any, roleCredentials: any, params: any, instancesData: any) {
  const ec2: AWS.EC2 = "awsRole" in account && roleCredentials ? new AWS.EC2({
    accessKeyId: roleCredentials.Credentials?.AccessKeyId as string,
    secretAccessKey: roleCredentials.Credentials?.SecretAccessKey as string,
    sessionToken: roleCredentials.Credentials?.SessionToken as string,
    region: region
  }) : new AWS.EC2({
    accessKeyId: account.awsAccessKey,
    secretAccessKey: account.awsSecretAccessKey,
    region: region
  });

  let isAccessible: string | undefined;
  try {
    const describeInstance: AWS.EC2.DescribeInstancesResult = await ec2.describeInstances(params).promise();
    if (!describeInstance.Reservations || describeInstance.Reservations.length === 0) {
      console.log(`${chalk.red("[ERROR]")} No reservations found`);
      return;
    }

    for await (const instance of describeInstance.Reservations) {
      // console.log(instance)
      let name;
      let username;

      if (!instance.Instances || instance.Instances.length === 0) {
        console.log(`${chalk.red("[ERROR]")} No instances found`);
        return;
      }

      if (!instance.Instances[0].ImageId || instance.Instances[0].ImageId.length === 0) {
        console.log(`${chalk.red("[ERROR]")} No image found`);
        return;
      }

      const describeImage: AWS.EC2.DescribeImagesResult = await ec2.describeImages({ ImageIds: [instance.Instances[0].ImageId] }).promise();
      if (!describeImage.Images || describeImage.Images.length === 0) {
        username = "Unknown";
      } else if (describeImage.Images[0].PlatformDetails?.includes("Linux")) {
        if (describeImage.Images[0].ImageLocation?.includes("ubuntu")) {
          username = "ubuntu";
        } else if (describeImage.Images[0].ImageLocation?.includes("CentOS")) {
          username = "centos";
        } else {
          username = "ec2-user";
        }
      } else if (describeImage.Images) {
        username = "Administrator";
      }

      if (!instance.Instances[0].SecurityGroups || instance.Instances[0].SecurityGroups.length === 0) {
        console.log(`${chalk.green("[INFO]")} No security groups.`);
        return;
      }

      for await (const securityGroup of instance.Instances[0].SecurityGroups) {
        isAccessible = await getSecurityGroups(securityGroup, ec2, instance);
      }

      if (!instance.Instances[0].Tags || instance.Instances[0].Tags.length === 0) {
        console.log(`${chalk.green("[INFO]")} No tags.`);
        return;
      }

      try {
        name = instance.Instances[0].Tags[0].Value;
      } catch {
        name = "N/A";
      }

      instancesData.awsManaged.push({
        Name: name || "N/A",
        Address: instance.Instances[0].PublicIpAddress || "N/A",
        "Key Pair": instance.Instances[0].KeyName || "N/A",
        Username: username || "N/A",
        State: instance.Instances[0].State?.Name || "N/A",
        Accessible: isAccessible,
        Location: region,
        Account: account.awsAccountName
      });
    }
  } catch (error) {
    return error;
  }

  return instancesData;
}

async function getSecurityGroups(securityGroup: any, ec2: AWS.EC2, instance: any): Promise<string | undefined> {
  let isAccessible: boolean = false;
  try {
    const describeSecurityGroup: AWS.EC2.DescribeSecurityGroupsResult = await ec2.describeSecurityGroups({ GroupIds: [securityGroup.GroupId] }).promise();
    if (!describeSecurityGroup.SecurityGroups || describeSecurityGroup.SecurityGroups.length === 0) {
      console.log(`${chalk.green("[INFO]")} No security groups found`);
      return undefined;
    }

    if (!describeSecurityGroup.SecurityGroups[0].IpPermissions || describeSecurityGroup.SecurityGroups[0].IpPermissions.length === 0) {
      console.log(`${chalk.green("[INFO]")} No IP permissions found`);
      return;
    }

    for await (const ipPerms of describeSecurityGroup.SecurityGroups[0].IpPermissions) {
      if (!ipPerms.IpProtocol || ipPerms.IpProtocol.length === 0) {
        console.log(`${chalk.green("[INFO]")} No IP protocol found`);
        return;
      }

      if (ipPerms.IpProtocol === "-1" || ipPerms.FromPort === 22 || ipPerms.ToPort === 22) {
        let ipAddress: string;
        try {
          const res = await axios.get("https://api.ipify.org");
          ipAddress = res.data;
        } catch (error: any) {
          console.log(error);
          return error;
        }

        if (!ipPerms.IpRanges || ipPerms.IpRanges.length === 0) {
          console.log(`${chalk.green("[INFO]")} No IP ranges found`);
          return;
        }

        if (ipPerms.IpRanges[0].CidrIp === ipAddress + "/32" || ipPerms.IpRanges[0].CidrIp === "0.0.0.0/0") {
          isAccessible = instance.Instances[0].State.Name === "running";
        } else if (isAccessible !== true) {
          isAccessible = false;
        }
      } else if (isAccessible !== true) {
        isAccessible = false;
      }
    }
  } catch (error: any) {
    return error;
  }

  return isAccessible.toString();
}
