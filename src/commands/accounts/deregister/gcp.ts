import { Command } from "@oclif/core";
import chalk from "chalk";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
const inquirer = require("inquirer");
import { IConfigData, IGcpAccountCredentials } from "../../../utils/interfaces";
import listGcpAccounts from "../../../utils/list-accounts/gcp";

export default class AccountsDeregisterCommand extends Command {
  static description: string = `Deregister a GCP account
Deregister a GCP account
`;

  static examples: Array<string> = [
    "$ serverx accounts deregister gcp"
  ];

  async run(): Promise<void> {
    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.gcpAccounts) {
      return;
    }

    if (configData.gcpAccounts.length === 0) {
      console.log(`${chalk.red("[ERROR]")} No GCP accounts registered`);
      return;
    }

    const accountName = await inquirer.prompt([
      {
        type: "input",
        name: "accountName",
        message: "GCP account name to deregister",
        validate: async (input: string) => {
          if (!input) {
            return "GCP account name is required";
          }

          if (!configData.gcpAccounts.some((account: IGcpAccountCredentials) => account.gcpAccountName === input)) {
            return "GCP account name not found";
          }

          return true;
        }
      }
    ]);

    const accountIndex: number = configData.gcpAccounts.findIndex((account: IGcpAccountCredentials) => account.gcpAccountName === accountName.accountName);

    configData.gcpAccounts.splice(accountIndex, 1);

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listGcpAccounts(this.config.configDir);
  }
}
