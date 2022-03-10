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

export default class DeregisterList extends Command {
  static description: string = `Deregister an account
Deregister an AWS or GCP account with serverx
`;

  static flags = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts deregeister"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(DeregisterList);

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

    if (configData.accountCredentials.length === 0) {
      console.log(`${chalk.red("[ERROR]")} No accounts registered`);
      return;
    }

    const index = await inquirer.prompt([
      {
        type: "input",
        name: "index",
        message: "Account index to remove",
        validate: (input: string) => {
          if (input.trim() === "") {
            return "Index is required";
          }

          try {
            const intInput: number = Number(input);

            if (Number.isNaN(input) || !Number.isInteger(intInput)) {
              return "Index must be an integer";
            }

            if (intInput < 0 || intInput > (configData?.accountCredentials || []).length - 1) {
              return `Index must be between 0 and ${(configData?.accountCredentials || []).length - 1}`;
            }
          } catch {
            return "Invalid index";
          }

          return true;
        },
        transform: (input: string) => {
          return Number.parseInt(input, 10);
        }
      }
    ]);

    configData.accountCredentials.splice(index.index, 1);

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
