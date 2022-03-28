import { Command, Flags } from "@oclif/core";
import { readJsonFile, writeJsonFile } from "../../../../utils/utils";
import listAwsAccounts from "../../../../utils/list-accounts/aws";
const inquirer = require("inquirer");
import { IAwsAccountCredentials, IAwsCredentialsFile, IConfigData } from "../../../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";
const papa = require("papaparse");
const fs = require("fs");
const path = require("path");
import chalk from "chalk";

export default class AccountsRegisterAwsImportCommand extends Command {
  static description: string = `Register an AWS account by importing
Register an AWS account by importing an existing credentials file
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
    "$ serverx accounts register aws --detail",
    "$ serverx accounts register aws import"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsRegisterAwsImportCommand);

    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData || !configData.awsAccounts) {
      return;
    }

    const fileLocation = await inquirer.prompt([
      {
        type: "input",
        name: "fileLocation",
        message: "AWS Credentials File",
        validate: (input: string) => {
          if (input.length === 0) {
            return "AWS credentials file is required";
          }

          if (!input.endsWith(".csv")) {
            return "AWS credentials file must be a CSV";
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

    if (fileLocation.fileLocation[0] === "~") {
      fileLocation.fileLocation = path.join(process.env.HOME, fileLocation.fileLocation.slice(1));
    }

    const credentialsFile: string = fs.readFileSync(fileLocation.fileLocation, "utf8");

    const credentials: any = papa.parse(credentialsFile, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true
    });

    if (!credentials.data || credentials.data.length === 0 || !credentials.data[0]["Access key ID"] || !credentials.data[0]["Secret access key"]) {
      console.log(`${chalk.red("[ERROR]")} No credentials found in file`);
      return;
    }

    configData.awsAccounts.push(await this.registerAWS(configData.awsAccounts, credentials.data[0]));

    const writeSuccess: boolean = await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));

    if (!writeSuccess) {
      return;
    }

    await listAwsAccounts(this.config.configDir, flags.detail);
  }

  async registerAWS(awsAccounts: Array<IAwsAccountCredentials>, credentials: IAwsCredentialsFile): Promise<IAwsAccountCredentials> {
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

    newAccount.awsAccessKey = credentials["Access key ID"];
    newAccount.awsSecretAccessKey = credentials["Secret access key"];

    delete newAccount.needRole;

    return newAccount;
  }
}
