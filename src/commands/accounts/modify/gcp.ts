import { Command } from "@oclif/core";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
import chalk from "chalk";
const inquirer = require("inquirer");
import { IConfigData, IGcpAccountCredentials } from "../../../utils/interfaces";
import listGcpAccounts from "../../../utils/list-accounts/gcp";
const path = require("path");
const fs = require("fs");

export default class AccountsModifyGcpCommand extends Command {
  static description: string = `Modify a GCP account
Modify a registered GCP account
`;

  static examples: Array<string> = [
    "$ serverx accounts modify gcp",
    "$ serverx accounts modify gcp --detail"
  ];

  async run(): Promise<void> {
    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.awsAccounts) {
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
        message: "GCP account name to modify",
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

    configData.gcpAccounts[accountIndex] = await this.modifyGCP(accountIndex, configData.gcpAccounts);

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listGcpAccounts(this.config.configDir);
  }

  async modifyGCP(index: number, gcpAccounts: Array<IGcpAccountCredentials>): Promise<IGcpAccountCredentials> {
    const tempGcpAccounts: Array<IGcpAccountCredentials> = [...gcpAccounts];

    tempGcpAccounts.splice(index, 1);

    const updatedAccount: IGcpAccountCredentials = await inquirer.prompt([
      {
        type: "input",
        name: "gcpAccountName",
        message: "Account Name",
        default: gcpAccounts[index].gcpAccountName,
        validate: (input: string) => {
          if (input === "") {
            return "GCP account name is required";
          }

          if (tempGcpAccounts.some((account: IGcpAccountCredentials) => account.gcpAccountName === input)) {
            return "GCP account name already exists";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "credentialsFile",
        message: "Credentials File Location",
        default: gcpAccounts[index].credentialsFile,
        validate: (input: string) => {
          if (input === "") {
            return "Credentials file location is required";
          }

          if (input[0] === "~") {
            input = path.join(process.env.HOME, input.slice(1));
          }

          if (!fs.existsSync(input)) {
            return `Could not find credentials file at: ${input}`;
          }

          return true;
        }
      }
    ]);

    if (updatedAccount.credentialsFile[0] === "~") {
      updatedAccount.credentialsFile = path.join(process.env.HOME, updatedAccount.credentialsFile.slice(1));
    }

    return updatedAccount;
  }
}
