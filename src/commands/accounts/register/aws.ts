import { Command, Flags } from "@oclif/core";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
import listAwsAccounts from "../../../utils/list-accounts/aws";
const inquirer = require("inquirer");
import { IConfigData, IAwsAccountCredentials } from "../../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsRegisterCommand extends Command {
  static description: string = `Register an AWS account
Register an AWS account
`;

  static flags: FlagInput<any> = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false,
      required: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts register aws",
    "$ serverx accounts register aws --detail"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsRegisterCommand);

    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.awsAccounts) {
      return;
    }

    configData.awsAccounts.push(await this.registerAWS(configData.awsAccounts));

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listAwsAccounts(this.config.configDir, flags.detail);
  }

  async registerAWS(awsAccounts: Array<IAwsAccountCredentials>): Promise<IAwsAccountCredentials> {
    const newAccount: IAwsAccountCredentials = await inquirer.prompt([
      {
        type: "input",
        name: "awsAccountName",
        message: "AWS Account Name",
        validate: (input: string) => {
          if (input.length === 0) {
            return "Account name is required";
          }

          if (awsAccounts.some((account: IAwsAccountCredentials) => account.awsAccountName === input)) {
            return "Account name already exists";
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
            return "AWS access key is required";
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

    delete newAccount.needRole;

    return newAccount;
  }
}
