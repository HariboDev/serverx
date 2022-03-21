import { Command } from "@oclif/core";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
const inquirer = require("inquirer");
import { IConfigData, IGcpAccountCredentials } from "../../../utils/interfaces";
import listGcpAccounts from "../../../utils/list-accounts/gcp";
const fs = require("fs");
const path = require("path");

export default class AccountsRegisterCommand extends Command {
  static description: string = `Register a GCP account
Register a GCP account
`;

  static examples: Array<string> = [
    "$ serverx accounts register gcp"
  ];

  async run(): Promise<void> {
    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.gcpAccounts) {
      return;
    }

    configData.gcpAccounts.push(await this.registerGCP(configData.gcpAccounts));

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listGcpAccounts(this.config.configDir);
  }

  async registerGCP(gcpAccounts: Array<IGcpAccountCredentials>): Promise<IGcpAccountCredentials> {
    const newAccount: IGcpAccountCredentials = await inquirer.prompt([
      {
        type: "input",
        name: "gcpAccountName",
        message: "Account Name",
        validate: (input: string) => {
          if (input === "") {
            return "GCP account name is required";
          }

          if (gcpAccounts.some((account: IGcpAccountCredentials) => account.gcpAccountName === input)) {
            return "GCP account name already exists";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "credentialsFile",
        message: "Credentials File Location",
        validate: (input: string) => {
          if (input === "") {
            return "Credentials file is required";
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

    if (newAccount.credentialsFile[0] === "~") {
      newAccount.credentialsFile = path.join(process.env.HOME, newAccount.credentialsFile.slice(1));
    }

    return newAccount;
  }
}
