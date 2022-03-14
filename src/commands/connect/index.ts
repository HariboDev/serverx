import { Command, Flags } from "@oclif/core";
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
import chalk from "chalk";
import SSH from "../../utils/ssh";
export default class ConnectCommand extends Command {
    static description = `Connect using SSH to an EC2 instance
Connect to an EC2 instance using either the instance index, name or address.\nAbility to override username and/or pem directory
`;

    static flags = {
      index: Flags.integer({ char: "i", description: "Instance index" }),
      name: Flags.string({ char: "n", description: "Instance name" }),
      address: Flags.string({ char: "a", description: "Instance Address" }),
      username: Flags.string({ char: "u", description: "Override connection username" }),
      directory: Flags.string({ char: "d", description: "Override pem file directory" }),
      key: Flags.string({ char: "k", description: "Override pem file name" }),
      password: Flags.boolean({ char: "p", description: "Ask for password" })
    };

    async run(): Promise<void>  {
      const { flags }: any = await this.parse(ConnectCommand);

      const instancesFile = path.join(this.config.dataDir, "instances.json");
      const instancesData = JSON.parse(fs.readFileSync(instancesFile));

      const configFile = path.join(this.config.configDir, "config.json");
      const configData = JSON.parse(fs.readFileSync(configFile));
      let instanceToConnect;
      console.log("Index: ", flags.index);
      
      if (flags.index || flags.index === 0) {
        instanceToConnect = flags.index <= instancesData.awsManaged.length - 1 ? instancesData.awsManaged[flags.index] : instancesData.selfManaged[flags.index - instancesData.awsManaged.length];
      } else if (flags.name) {
        let instanceIndex = -1;
        for(let instance of instancesData.awsManaged) {
          if (instance.Name === flags.name) {
            instanceIndex = instancesData.awsManaged.indexOf(instance);
          }
        };

        if (instanceIndex === -1) {
        for(let instance of instancesData.selfManaged) {
          if (instance.Name === flags.name) {
            instanceIndex = instancesData.selfManaged.indexOf(instance);
          }
        }
          instanceToConnect = instancesData.selfManaged[instanceIndex];
        } else {
          instanceToConnect = instancesData.awsManaged[instanceIndex];
        }
      } else if (flags.address) {
        let instanceIndex = -1;
        for(let instance of instancesData.awsManaged) {
          if (instance.Address === flags.address) {
            instanceIndex = instancesData.awsManaged.indexOf(instance);
          }
        }

        if (instanceIndex === -1) {
          for(let instance of instancesData.selfManaged) {
            if (instance.Address === flags.address) {
              instanceIndex = instancesData.selfManaged.indexOf(instance);
            }
          }
          instanceToConnect = instancesData.selfManaged[instanceIndex];
        } else {
          instanceToConnect = instancesData.awsManaged[instanceIndex];
        }
      }

      if (instanceToConnect === undefined) {
        console.log(`${chalk.red("[ERROR]")} Invalid selection`);
      } else if (instanceToConnect.Accessible === false) {
        console.log(`${chalk.red("[ERROR]")} Instance is not accessible`);
      } else {
        const username = flags.username ? flags.username : instanceToConnect.Username;
        let password;
        let key;
        if (flags.password || instanceToConnect["Key Pair"] === "N/A") {
          password = await inquirer.prompt([
            {
              type: "password",
              name: "password",
              message: `Enter password for ${username}@${instanceToConnect.Address}:22`,
              validate: (input: string) => {
                if (input.length === 0) {
                  return "Password cannot be empty";
                }
                return true;
              }
            }
          ]);
      
        } else {
          const directory = flags.directory ? flags.directory : configData["pemDir"];

          key = await (flags.key ? this.resolveHome(directory + "/" + flags.key) : this.resolveHome(directory + "/" + instanceToConnect["Key Pair"]));
        }

        console.log("");
        console.log(`${chalk.green("[INFO]")} Connecting to "${instanceToConnect.Name}" as "${username}" at "${instanceToConnect.Address}:22"`);
        console.log(`${chalk.green("[INFO]")} If these details are incorrect, execute "serverx list" to update instance details and try again`);
        console.log(`${chalk.green("[INFO]")} Attempting to connect...`);
        console.log("");

        await SSH(instanceToConnect.Address, username, key, password);
      }
    }

    async resolveHome(filepath: string) {
      const validFileExtensions = [".pem", ".ppk"];

      if (filepath[0] === "~") {
        filepath = path.join(process.env.HOME, filepath.slice(1));
      }

      if (validFileExtensions.includes(filepath.slice(-4))) {
        if (fs.existsSync(filepath)) {
          return filepath;
        }
      } else {
        for (const extension of validFileExtensions) {
          if (fs.existsSync(filepath + extension)) {
            return filepath + extension;
          }
        }
      }

      console.log(`${chalk.red("[ERROR]")} Could not find key file: ${filepath}`);
      process.exit();
    }
}
