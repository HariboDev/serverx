import { Command } from "@oclif/core";
import { isPortReachable, readJsonFile, writeJsonFile } from "../../../utils/utils";
const inquirer = require("inquirer");
import { IInstance, IInstancesData } from "../../../utils/interfaces";
import chalk from "chalk";

export default class ServersModifyCommand extends Command {
  static description: string = `Modify an self-managed server
Modify a self-managed server
`;

  static examples: Array<string> = [
    "$ serverx servers modify"
  ];

  async run(): Promise<void> {
    const instancesData: IInstancesData = await readJsonFile(this.config.dataDir, "instances");

    if (!instancesData || !instancesData.self) {
      return;
    }

    const addressResponse = await inquirer.prompt([
      {
        type: "input",
        name: "address",
        message: "Server address to modify",
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

    const oldInstance: IInstance | undefined = instancesData.self.find((instance: IInstance) => instance.address === addressResponse.address);

    if (!oldInstance) {
      console.log(`${chalk.red("[ERROR]")} Unable find server with address: ${chalk.yellow(addressResponse.address)}`);
      return;
    }

    const updatedServer: IInstance = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Server Name",
        default: oldInstance.name,
        validate: async (input: string) => {
          if (!input) {
            return "Server name is required";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "address",
        message: "Server Address",
        default: oldInstance.address,
        validate: async (input: string) => {
          if (!input) {
            return "Server address is required";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "location",
        message: "Server Location"
      },
      {
        type: "input",
        name: "username",
        message: "Username",
        default: oldInstance.username,
        validate: async (input: string) => {
          if (!input) {
            return "Username is required";
          }

          return true;
        }
      },
      {
        type: "confirm",
        name: "hasKeyPair",
        default: oldInstance.keyPair === undefined,
        message: "Do you want to use a key pair?"
      },
      {
        type: "input",
        name: "keyPair",
        message: "Key Pair",
        default: oldInstance.keyPair || "",
        when: (answers: any) => {
          return answers.hasKeyPair;
        },
        validate: async (input: string) => {
          if (!input) {
            return "Key pair is required";
          }

          return true;
        }
      }
    ]);

    if (!updatedServer.hasKeyPair) {
      delete updatedServer.keyPair;
    }

    delete updatedServer.hasKeyPair;

    updatedServer.state = "Unknown";
    updatedServer.accessible = await isPortReachable(22, { host: updatedServer.address, timeout: 1000 });
    updatedServer.account = "Unknown";

    const index: number = instancesData.self.indexOf(oldInstance);

    instancesData.self[index] = updatedServer;

    await writeJsonFile(this.config.dataDir, "instances", JSON.stringify(instancesData));
  }
}
