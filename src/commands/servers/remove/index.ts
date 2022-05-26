import { Command } from "@oclif/core";
import chalk from "chalk";
import { readJsonFile, writeJsonFile } from "../../../utils/utils";
const inquirer = require("inquirer");
import { IInstance, IInstancesData } from "../../../utils/interfaces";

export default class ServersRemoveCommand extends Command {
  static description: string = `Remove a self-managed server
Remove a self-managed server
`;

  static examples: Array<string> = [
    "$ serverx servers remove"
  ];

  async run(): Promise<void> {
    const instancesData: IInstancesData | undefined = await readJsonFile(this.config.dataDir, "instances");

    if (!instancesData || !instancesData.self) {
      return;
    }

    const addressResponse = await inquirer.prompt([
      {
        type: "input",
        name: "address",
        message: "Server address to remove",
        validate: async (input: string) => {
          if (input === "") {
            return "Server address is required";
          }

          const valid: boolean = instancesData.self.some((instance: IInstance) => instance.address === input);

          if (!valid) {
            return `Server address ${chalk.yellow(input)} not found`;
          }

          return true;
        }
      }
    ]);

    const index: number = instancesData.self.indexOf(addressResponse.address);

    instancesData.self.splice(index, 1);

    await writeJsonFile(this.config.dataDir, "instances", JSON.stringify(instancesData));
  }
}
