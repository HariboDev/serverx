import Table from "cli-table3";
const fs = require("fs");
const path = require("path");
import chalk from "chalk";

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

export default async function listAccounts(configDir: string, detail: boolean): Promise<void> {
  let configData: IConfigData = {};

  try {
    configData = JSON.parse(fs.readFileSync(path.join(configDir, "config.json")));
    console.log(`${chalk.green("[INFO]")} Config file located`);
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to locate config file`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
    return;
  }

  const table: Table.Table = new Table({
    head: [
      chalk.blueBright("Index"),
      chalk.blueBright("Account Name"),
      chalk.blueBright("Access Key"),
      chalk.blueBright("Secret Access Key"),
      chalk.blueBright("Role ARN")
    ]
  });

  for (const account of configData?.accountCredentials || []) {
    let secret: string = account.awsSecretAccessKey;

    if (!detail) {
      const mask: string = secret.slice(0, -4).replace(/./g, "*");
      const lastFour: string = secret.slice(-4);
      secret = `${mask}${lastFour}`;
    }

    let role: string = account.awsRole || "";

    if (!role) {
      role = chalk.grey("N/A");
    }

    table.push([
      (configData?.accountCredentials || []).indexOf(account),
      account.awsAccountName,
      account.awsAccessKey,
      secret,
      role
    ]);
  }

  console.log(table.toString());
}
