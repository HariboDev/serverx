import { Command, Flags } from "@oclif/core";
import { readJsonFile, writeJsonFile } from "../../utils/utils";
import listAccounts from "../../utils/list-accounts";
const inquirer = require("inquirer");
import { IConfigData, IAccountCredentials } from "../../utils/interfaces";

export default class AccountsList extends Command {
  static description: string = `Register an account
Register an AWS or GCP account with serverx
`;

  static flags = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts register"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsList);

    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.accountCredentials) {
      return;
    }

    const newAccount: IAccountCredentials = await inquirer.prompt([
      {
        type: "input",
        name: "awsAccountName",
        message: "AWS Account Name",
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS Account Name is required";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "awsAccessKey",
        message: "AWS Access Key",
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS Access Key is required";
          }

          return true;
        }
      },
      {
        type: "password",
        name: "awsSecretAccessKey",
        message: "AWS Secret Access Key",
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS Secret Access Key is required";
          }

          return true;
        }
      },
      {
        type: "confirm",
        name: "needRole",
        message: "Do you need to assume a role?",
        default: false
      },
      {
        type: "input",
        name: "awsRole",
        message: "Role ARN",
        when: (answers: any) => {
          return answers.needRole;
        },
        validate: (input: string) => {
          if (input.length === 0) {
            return "Role ARN is required";
          }

          return true;
        }
      }
    ]);

    configData.accountCredentials.push(newAccount);

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listAccounts(this.config.configDir, flags.detail);
  }
}
