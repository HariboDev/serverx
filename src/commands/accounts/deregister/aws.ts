import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import listAwsAccounts from "../../../utils/list-accounts/aws";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
const inquirer = require("inquirer");
import { IAwsAccountCredentials, IConfigData } from "../../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsDeregisterCommand extends Command {
  static description: string = `Deregister an AWS account
Deregister an AWS account
`;

  static flags: FlagInput<any> = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts deregister aws",
    "$ serverx accounts deregister aws --detail"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsDeregisterCommand);

    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.awsAccounts) {
      return;
    }

    if (configData.awsAccounts.length === 0) {
      console.log(`${chalk.red("[ERROR]")} No AWS accounts registered`);
      return;
    }

    const accountName = await inquirer.prompt([
      {
        type: "input",
        name: "accountName",
        message: "AWS account name to deregister",
        validate: async (input: string) => {
          if (!input) {
            return "AWS account name is required";
          }

          if (!configData.awsAccounts.some((account: IAwsAccountCredentials) => account.awsAccountName === input)) {
            return "AWS account name not found";
          }

          return true;
        }
      }
    ]);

    const accountIndex: number = configData.awsAccounts.findIndex((account: IAwsAccountCredentials) => account.awsAccountName === accountName.accountName);

    configData.awsAccounts.splice(accountIndex, 1);

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listAwsAccounts(this.config.configDir, flags.detail);
  }
}
