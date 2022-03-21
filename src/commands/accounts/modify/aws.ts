import { Command, Flags } from "@oclif/core";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
import chalk from "chalk";
import listAwsAccounts from "../../../utils/list-accounts/aws";
const inquirer = require("inquirer");
import { IAwsAccountCredentials, IConfigData } from "../../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsModifyAwsCommand extends Command {
  static description: string = `Modify an AWS account
Modify a registered AWS account
`;

  static flags: FlagInput<any> = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts modify aws",
    "$ serverx accounts modify aws --detail"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsModifyAwsCommand);

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
        message: "AWS account name to modify",
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

    configData.awsAccounts[accountIndex] = await this.modifyAWS(accountIndex, configData.awsAccounts);

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listAwsAccounts(this.config.configDir, flags.detail);
  }

  async modifyAWS(index: number, awsAccounts: Array<IAwsAccountCredentials>): Promise<IAwsAccountCredentials> {
    const tempAwsAccounts: Array<IAwsAccountCredentials> = [...awsAccounts];

    tempAwsAccounts.splice(index, 1);

    const updatedAccount = await inquirer.prompt([
      {
        type: "input",
        name: "awsAccountName",
        message: "AWS Account Name",
        default: awsAccounts[index].awsAccountName,
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS account name is required";
          }

          if (tempAwsAccounts.some((account: IAwsAccountCredentials) => account.awsAccountName === input)) {
            return "AWS account name already exists";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "awsAccessKey",
        message: "AWS Access Key",
        default: awsAccounts[index].awsAccessKey,
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS access key is required";
          }

          return true;
        }
      },
      {
        type: "password",
        name: "awsSecretAccessKey",
        message: "AWS Secret Access Key",
        default: awsAccounts[index].awsSecretAccessKey,
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS secret access key is required";
          }

          return true;
        }
      },
      {
        type: "list",
        name: "needRole",
        message: "Do you need to assume a role?",
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          }
        ]
      },
      {
        type: "input",
        name: "awsRole",
        message: "Role ARN",
        default: awsAccounts[index].awsRole || "",
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

    if (!updatedAccount.needRole) {
      delete updatedAccount.awsRole;
    }

    delete updatedAccount.needRole;

    return updatedAccount;
  }
}
