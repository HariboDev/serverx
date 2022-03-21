import { Command } from "@oclif/core";
import inquirer from "inquirer";
import { isPortReachable } from "../../utils/utils";
import { IInstance, IInstancesData } from "../../utils/interfaces";
import { readJsonFile, writeJsonFile } from "../../utils/utils";
const path = require("path");

export default class ServersAddCommand extends Command {
  static description: string = `Add a self-managed server
Add a self-managed server
`;

  static examples: Array<string> = [
    "$ serverx servers add"
  ];

  async run(): Promise<void> {
    const instancesData: IInstancesData = await readJsonFile(this.config.dataDir, "instances");

    if (!instancesData) {
      return;
    }

    const newServer: IInstance = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Server Name",
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
        message: "Server Location",
        default: "Unknown"
      },
      {
        type: "input",
        name: "username",
        message: "Username",
        validate: async (input: string) => {
          if (!input) {
            return "Username is required";
          }

          return true;
        }
      },
      {
        type: "list",
        name: "hasKeyPair",
        message: "Do you want to use a key pair?",
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
        name: "keyPair",
        message: "Key Pair",
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

    delete newServer.hasKeyPair;

    if (newServer.keyPair && newServer.keyPair[0] === "~") {
      newServer.keyPair = path.join(process.env.HOME, newServer.keyPair.slice(1));
    }

    newServer.state = "Unknown";
    newServer.accessible = await isPortReachable(22, { host: newServer.address as string, timeout: 1000 });
    newServer.account = "Unknown";

    instancesData.self.push(newServer);

    await writeJsonFile(this.config.dataDir, "instances", JSON.stringify(instancesData));
  }
}
