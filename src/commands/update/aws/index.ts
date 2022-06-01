import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import { IAwsAccountCredentials, IConfigData, IDataData, IIPChange } from "../../../utils/interfaces";
import { getEnabledRegions, checkIpChanged, readJsonFile, writeJsonFile } from "../../../utils/utils";
import * as AWS from "aws-sdk";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class UpdateCommandAWS extends Command {
  static description: string = `Update security groups with your new public IP
Checks if your public IP has changed and updates relevant AWS security groups
`;

  static flags: FlagInput<any> = {
    region: Flags.string({
      char: "r",
      description: "Only update security groups in a specific region(s)",
      required: false,
      multiple: true,
      default: "all",
      options: [
        "us-east-1",
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
        "sa-east-1"
      ]
    }),
    account: Flags.string({
      char: "a",
      description: "Only update security groups in a specific account(s)",
      multiple: true,
      default: "all"
    }),
    from: Flags.string({
      char: "f",
      description: "Only update security groups with this as its existing source IP address. Overrides the users actual old IP",
      required: false
    }),
    to: Flags.string({
      char: "t",
      description: "Only update security groups with this as its new source IP address. Overrides users actual current IP",
      required: false
    })
  }

  static examples: Array<string> = [
    "$ serverx update",
    "$ serverx update aws",
    "$ serverx update aws --region eu-west-1"
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(UpdateCommandAWS);

    const dataData: IDataData = await readJsonFile(this.config.dataDir, "data");

    if (!dataData) {
      return;
    }

    let fromIp: string | undefined = flags.from;
    let toIp: string | undefined = flags.to;

    if (flags.from) {
      fromIp = flags.from;
    } else {
      const checkResponse: IIPChange | undefined = await checkIpChanged(dataData);

      if (!checkResponse) {
        return;
      }

      fromIp = checkResponse.oldIp;
      toIp = checkResponse.newIp;
    }

    if (fromIp && toIp) {
      const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

      if (!configData) {
        return;
      }

      const accountsToSearch: Array<IAwsAccountCredentials> = flags.account.toString() === "all" ?
        configData.awsAccounts : configData.awsAccounts.filter((account: IAwsAccountCredentials) => {
          return flags.account.toString().split(",").includes(account.awsAccountName);
        });

      for await (const account of accountsToSearch) {
        console.log(`${chalk.green("[INFO]")} Checking account: ${account.awsAccountName}`);

        const regions: Array<string> = flags.region.toString() === "all" ? (await getEnabledRegions(account)) : flags.region.toString().split(",");

        for await (const region of regions) {
          await this.checkRegion(region, account, toIp, fromIp);
        }

        if (!flags.toIp) {
          dataData.ip = toIp;
          await writeJsonFile(this.config.dataDir, "data", JSON.stringify(dataData));
        }
      }
    }
  }

  async checkRegion(region: string, account: IAwsAccountCredentials, newIp: string, oldIp: string): Promise<void> {
    console.log(`${chalk.green("[INFO]")} Checking region: ${region}`);

    const ec2 = new AWS.EC2({
      accessKeyId: account.awsAccessKey,
      secretAccessKey: account.awsSecretAccessKey,
      region: region
    });

    try {
      const securityGroupsResponse: AWS.EC2.DescribeSecurityGroupsResult = await ec2.describeSecurityGroups().promise();

      if (!securityGroupsResponse.SecurityGroups || securityGroupsResponse.SecurityGroups.length === 0) {
        console.log(`${chalk.green("[INFO]")} No security groups found`);
        return;
      }

      let relevantRule: boolean = false;

      for await (const securityGroup of securityGroupsResponse.SecurityGroups) {
        if (!securityGroup.GroupId || !securityGroup.IpPermissions || securityGroup.IpPermissions.length === 0) {
          return;
        }

        for await (const ipPerms of securityGroup.IpPermissions) {
          if (!ipPerms.IpRanges || ipPerms.IpRanges.length === 0) {
            continue;
          }

          for await (const ranges of ipPerms.IpRanges) {
            if (ranges.CidrIp === oldIp + "/32") {
              relevantRule = true;
              const authorizeResponse: boolean = await this.addRuleToSecurityGroup(ec2, securityGroup.GroupId, ipPerms, newIp);

              if (authorizeResponse && oldIp) {
                await this.deleteRuleFromSecurityGroup(ec2, securityGroup.GroupId, ipPerms, oldIp);
              }
            }
          }
        }
      }

      if (!relevantRule) {
        console.log(`${chalk.green("[INFO]")} No relevant ingress rules to change`);
      }
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to describe security groups`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
    }
  }

  async addRuleToSecurityGroup(ec2: AWS.EC2, sgId: string, ipPerms: AWS.EC2.IpPermission, newIp: string): Promise<boolean> {
    const params = {
      GroupId: sgId,
      IpPermissions: [
        {
          FromPort: ipPerms.FromPort,
          IpProtocol: ipPerms.IpProtocol,
          IpRanges: [
            {
              CidrIp: newIp + "/32"
            }
          ],
          ToPort: ipPerms.ToPort
        }
      ]
    };

    try {
      await ec2.authorizeSecurityGroupIngress(params).promise();
      console.log(`${chalk.green("[INFO]")} Successfully added new security group ingress rule`);
      return true;
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to add new security group ingress rule`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
      return false;
    }
  }

  async deleteRuleFromSecurityGroup(ec2: AWS.EC2, sgId: string, ipPerms: AWS.EC2.IpPermission, oldIp: string): Promise<void> {
    const params = {
      GroupId: sgId,
      IpPermissions: [
        {
          FromPort: ipPerms.FromPort,
          IpProtocol: ipPerms.IpProtocol,
          IpRanges: [
            {
              CidrIp: oldIp + "/32"
            }
          ],
          ToPort: ipPerms.ToPort
        }
      ]
    };

    try {
      await ec2.revokeSecurityGroupIngress(params).promise();
      console.log(`${chalk.green("[INFO]")} Successfully deleted old security group ingress rule`);
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to delete old security group ingress rule`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
    }
  }
}
