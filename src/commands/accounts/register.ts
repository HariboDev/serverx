import { Command, Flags } from "@oclif/core";
const fs = require("fs");
const path = require("path");
import chalk from "chalk";
import listAccounts from "../../list-accounts";
const inquirer = require("inquirer");

interface IConfigData {
  pemDir?: string;
  accountCredentials?: Array<IAccountCredentials>;
}

interface IAccountCredentials {
  awsAccountName: string;
  awsAccessKey: string;
  awsSecretAccessKey: string;
  awsRole?: string;
}

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

    let configData: IConfigData = {};

    try {
      configData = JSON.parse(fs.readFileSync(path.join(this.config.configDir, "config.json")));
      console.log(`${chalk.green("[INFO]")} Config file located`);

      if (!configData.accountCredentials) {
        configData.accountCredentials = [];
      }
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to locate config file`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
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

    try {
      fs.writeFileSync(path.join(this.config.configDir, "config.json"), JSON.stringify(configData));
      console.log(`${chalk.green("[INFO]")} Successfully saved config data`);
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to save config file`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
      return;
    }

    await listAccounts(this.config.configDir, flags.detail);
  }
}
