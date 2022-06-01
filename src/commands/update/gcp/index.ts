import Compute, { FirewallsClient, SecurityPoliciesClient } from "@google-cloud/compute";
import { Command, Flags } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";
import chalk from "chalk";
import { allGcpRegions } from "../../../utils/gcp-zones";
import { IConfigData, IDataData, IGcpAccountCredentials, IIPChange } from "../../../utils/interfaces";
import { checkIpChanged, readJsonFile, writeJsonFile } from "../../../utils/utils";

export default class UpdateCommandGCP extends Command {
  static description: string = `Update firewall rules and cloud armor with your new public IP
Checks if your public IP has changed and updates relevant GCP firewall rules and cloud armor policies
`;

  static flags: FlagInput<any> = {
    region: Flags.string({
      char: "r",
      description: "Only update firewall and cloud armor armor rules in a specific region(s)",
      required: false,
      multiple: true,
      default: "all",
      options: allGcpRegions
    }),
    account: Flags.string({
      char: "a",
      description: "Only update firewall and cloud armor armor rules in a specific account(s)",
      multiple: true,
      default: "all"
    }),
    from: Flags.string({
      char: "f",
      description: "Only update firewall and cloud armor armor rules with this as its existing source IP address. Overrides the users actual old IP",
      required: false
    }),
    to: Flags.string({
      char: "t",
      description: "Only update firewall and cloud armor armor rules with this as its new source IP address. Overrides users actual current IP",
      required: false
    })
  }

  static examples: Array<string> = [
    "$ serverx update",
    "$ serverx update gcp"
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(UpdateCommandGCP);

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

      const accountsToSearch: Array<IGcpAccountCredentials> = flags.account.toString() === "all" ?
        configData.gcpAccounts : configData.gcpAccounts.filter((account: IGcpAccountCredentials) => {
          return flags.account.toString().split(",").includes(account.gcpAccountName);
        });

      for await (const account of accountsToSearch) {
        console.log(`${chalk.green("[INFO]")} Checking account: ${account.gcpAccountName}`);
        process.env.GOOGLE_APPLICATION_CREDENTIALS = account.credentialsFile;

        const firewallClient: FirewallsClient = new Compute.FirewallsClient();

        const firewalls = await firewallClient.list({
          project: account.gcpProjectId
        });

        for await (const firewall of firewalls[0]) {
          if (!firewall.sourceRanges?.includes(fromIp + "/32")) {
            console.log(`${chalk.green("[INFO]")} No relevant ingress rules to change`);
            continue;
          }

          try {
            await firewallClient.patch({
              firewall: firewall.name,
              project: account.gcpProjectId,
              firewallResource: {
                sourceRanges: [toIp + "/32"]
              }
            });
            console.log(`${chalk.green("[INFO]")} Successfully updated firewall ingress rule`);
          } catch (error) {
            console.log(`${chalk.red("[ERROR]")} Unable to update firewall ingress rule`);
            console.log(`${chalk.red("[REASON]")} ${error}`);
          }
        }

        const securityPolicyClient: SecurityPoliciesClient = new Compute.SecurityPoliciesClient();

        const securityPolicies = await securityPolicyClient.list({
          project: account.gcpProjectId
        });

        for await (const policy of securityPolicies[0]) {
          console.log(`${chalk.green("[INFO]")} Checking Cloud Armor policy: ${policy.name}`);

          for await (const rule of (policy.rules || [])) {
            if (!(rule.match?.config?.srcIpRanges || []).includes(fromIp + "/32")) {
              console.log(`${chalk.green("[INFO]")} No relevant ingress rules to change`);
              continue;
            }

            if (!rule.match || !rule.match.config || !rule.match.config.srcIpRanges) {
              return;
            }

            rule.match.config.srcIpRanges = rule.match.config.srcIpRanges.filter((ip: any) => !ip.includes(fromIp));
            rule.match.config.srcIpRanges.push(toIp + "/32");

            try {
              await securityPolicyClient.patchRule({
                project: account.gcpProjectId,
                securityPolicy: policy.name,
                priority: rule.priority,
                securityPolicyRuleResource: {
                  match: {
                    versionedExpr: rule.match.versionedExpr,
                    config: {
                      srcIpRanges: rule.match.config.srcIpRanges
                    }
                  }
                }
              });
              console.log(`${chalk.green("[INFO]")} Successfully updated Cloud Armor ingress rule`);
            } catch (error) {
              console.log(`${chalk.red("[ERROR]")} Unable to update Cloud Armor ingress rule`);
              console.log(`${chalk.red("[REASON]")} ${error}`);
            }
          }
        }

        if (!flags.toIp) {
          dataData.ip = toIp;
          await writeJsonFile(this.config.dataDir, "data", JSON.stringify(dataData));
        }
      }
    }
  }
}
