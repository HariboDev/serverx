import Compute, { FirewallsClient, SecurityPoliciesClient } from "@google-cloud/compute";
import { Command } from "@oclif/core";
import chalk from "chalk";
import { IConfigData, IDataData, IIPChange } from "../../../utils/interfaces";
import { checkIpChanged, readJsonFile, writeJsonFile } from "../../../utils/utils";

export default class UpdateCommandGCP extends Command {
  static description: string = `Update firewall rules and cloud armor with your new public IP
Checks if your public IP has changed and updates relevant GCP firewall rules and cloud armor policies
`;

  static examples: Array<string> = [
    "$ serverx update",
    "$ serverx update gcp"
  ];

  async run(): Promise<void> {
    const dataData: IDataData = await readJsonFile(this.config.dataDir, "data");

    if (!dataData) {
      return;
    }

    const checkResponse: IIPChange | undefined = await checkIpChanged(dataData);

    if (!checkResponse) {
      return;
    }

    if (checkResponse.oldIp) {
      const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

      if (!configData) {
        return;
      }

      for await (const account of configData.gcpAccounts) {
        console.log(`${chalk.green("[INFO]")} Checking account: ${account.gcpAccountName}`);
        process.env.GOOGLE_APPLICATION_CREDENTIALS = account.credentialsFile;

        const firewallClient: FirewallsClient = new Compute.FirewallsClient();

        const firewalls = await firewallClient.list({
          project: account.gcpProjectId
        });

        for await (const firewall of firewalls[0]) {
          if (!firewall.sourceRanges?.includes(checkResponse.oldIp + "/32")) {
            console.log(`${chalk.green("[INFO]")} No relevant ingress rules to change`);
            continue;
          }

          try {
            await firewallClient.patch({
              firewall: firewall.name,
              project: account.gcpProjectId,
              firewallResource: {
                sourceRanges: [checkResponse.newIp + "/32"]
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
            if (!(rule.match?.config?.srcIpRanges || []).includes(checkResponse.oldIp + "/32")) {
              console.log(`${chalk.green("[INFO]")} No relevant ingress rules to change`);
              continue;
            }

            if (!rule.match || !rule.match.config || !rule.match.config.srcIpRanges) {
              return;
            }

            rule.match.config.srcIpRanges = rule.match.config.srcIpRanges.filter((ip: any) => !ip.includes(checkResponse.oldIp));
            rule.match.config.srcIpRanges.push(checkResponse.newIp + "/32");

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

        dataData.ip = checkResponse.newIp;
        await writeJsonFile(this.config.dataDir, "data", JSON.stringify(dataData));
      }
    }
  }
}
