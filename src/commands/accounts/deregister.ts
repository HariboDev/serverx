import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import listAccounts from "../../utils/list-accounts";
import { readJsonFile, validateIndex, writeJsonFile } from "../../utils/utils";
const inquirer = require("inquirer");
import { IConfigData } from "../../utils/interfaces";

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
    "$ serverx accounts deregister"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(DeregisterList);

    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.accountCredentials) {
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
        validate: async (input: string) => {
          const valid: boolean | string = await validateIndex(input, (configData.accountCredentials || []).length - 1);
          return valid;
        },
        transform: (input: string) => {
          return Number.parseInt(input, 10);
        }
      }
    ]);

    configData.accountCredentials.splice(index.index, 1);

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listAccounts(this.config.configDir, flags.detail);
  }
}
