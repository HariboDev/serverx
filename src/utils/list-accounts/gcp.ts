import Table from "cli-table3";
import chalk from "chalk";
import { readJsonFile } from "../utils";
import { IConfigData } from "../interfaces";

export default async function listGcpAccounts(configDir: string): Promise<void> {
  const configData: IConfigData = await readJsonFile(configDir, "config");

  if (!configData) {
    return;
  }

  const table: Table.Table = new Table({
    head: [
      chalk.blueBright("Account Name"),
      chalk.blueBright("Project ID"),
      chalk.blueBright("Credentials File Location")
    ]
  });

  for (const account of configData.gcpAccounts || []) {
    table.push([
      account.gcpAccountName,
      account.gcpProjectId,
      account.credentialsFile
    ]);
  }

  console.log(table.toString());
}
