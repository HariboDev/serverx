import { Command, Flags } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
import chalk from "chalk";
import { IConfigData, IInstance, IInstancesData } from "../../utils/interfaces";
import sshUtil from "../../utils/ssh";
import { isPortReachable, readJsonFile } from "../../utils/utils";

export default class ConnectCommand extends Command {
  static description: string = `Connect to an AWS server with SSH
Connect to an AWS server with SSH using either the instance name or address.\nAbility to override username, key directory, key file and port.
`;

  static flags: FlagInput<any> = {
    name: Flags.string({ char: "n", description: "Instance Name" }),
    address: Flags.string({ char: "a", description: "Instance Address" }),
    username: Flags.string({ char: "u", description: "Override connection username" }),
    directory: Flags.string({ char: "d", description: "Override key file directory" }),
    key: Flags.string({ char: "k", description: "Override key file name" }),
    port: Flags.string({ description: "Override port", default: "22" }),
    password: Flags.boolean({ char: "p", description: "Ask for password" })
  };

  async run(): Promise<void> {
    const { flags }: any = await this.parse(ConnectCommand);

    const configData: IConfigData = await readJsonFile(this.config.configDir, "config");

    if (!configData) {
      return;
    }

    const instancesData: IInstancesData = await readJsonFile(this.config.dataDir, "instances");

    if (!instancesData) {
      return;
    }

    if (!flags.name && !flags.address) {
      console.log(`${chalk.red("[ERROR]")} Please provide either an instance name or address.`);
      return;
    }

    let instanceToConnect: IInstance | undefined;

    if (flags.name) {
      for await (const instance of instancesData.aws) {
        if (instance.name === flags.name) {
          instanceToConnect = instance;
          break;
        }
      }

      if (!instanceToConnect) {
        for (const instance of instancesData.gcp) {
          if (instance.name === flags.name) {
            instanceToConnect = instance;
            break;
          }
        }
      }

      if (!instanceToConnect) {
        for (const instance of instancesData.self) {
          if (instance.name === flags.name) {
            instanceToConnect = instance;
            break;
          }
        }
      }

      if (!instanceToConnect) {
        console.log(`${chalk.red("[ERROR]")} Could not find instance with name: ${flags.name}`);
        return;
      }
    } else if (flags.address) {
      for (const instance of instancesData.aws) {
        if (instance.address === flags.address) {
          instanceToConnect = instance;
        }
      }

      if (!instanceToConnect) {
        for (const instance of instancesData.gcp) {
          if (instance.address === flags.address) {
            instanceToConnect = instance;
          }
        }
      }

      if (!instanceToConnect) {
        for (const instance of instancesData.self) {
          if (instance.address === flags.address) {
            instanceToConnect = instance;
          }
        }
      }

      if (!instanceToConnect) {
        console.log(`${chalk.red("[ERROR]")} Could not find instance with address: ${flags.address}`);
        return;
      }
    }

    if (!instanceToConnect) {
      console.log(`${chalk.red("[ERROR]")} Provide either an instance name or address`);
      return;
    }

    if (instanceToConnect.accessible === false || flags.port !== "22") {
      console.log(`${chalk.red("[ERROR]")} Checking instance reachability`);

      try {
        if (Number.isNaN(flags.port) || !Number.isInteger(Number(flags.port))) {
          console.log(`${chalk.red("[ERROR]")} Invalid port number`);
          return;
        }
      } catch {
        console.log(`${chalk.red("[ERROR]")} Invalid port number`);
        return;
      }

      const accessible: boolean = await isPortReachable(flags.port, { host: instanceToConnect.address, timeout: 1000 });

      if (accessible) {
        console.log(`${chalk.green("[INFO]")} Instance is accessible`);
      } else {
        console.log(`${chalk.red("[ERROR]")} Could not connect to instance`);
      }
    }

    if (instancesData.gcp.includes(instanceToConnect)) {
      if (!flags.username) {
        console.log(`${chalk.red("[ERROR]")} You must provide a username for GCP instances`);
        return;
      }

      instanceToConnect.username = flags.username;
    }

    await this.connect(instanceToConnect, flags, configData);
  }

  async connect(instanceToConnect: IInstance, flags: FlagInput<any>, configData: IConfigData): Promise<void> {
    const username = flags.username || instanceToConnect.username;
    const password = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: `Enter password for ${username}@${instanceToConnect.address}:${flags.port}`,
        when: flags.password || (!instanceToConnect.keyPair && !flags.key),
        validate: (input: string) => {
          if (input === "") {
            return "Password cannot be empty";
          }

          return true;
        }
      }
    ]);

    const directory: string = flags.directory ? flags.directory.toString() : configData.keyDir;

    const key: string | undefined = flags.key ? await this.resolveHome(directory + "/" + flags.key.toString()) : await this.resolveHome(directory + "/" + (instanceToConnect.keyPair || ""));

    if (!key) {
      return;
    }

    console.log("");
    console.log(`${chalk.green("[INFO]")} Connecting to "${instanceToConnect.name}" as "${username}" at "${instanceToConnect.address}:${flags.port}"`);
    console.log(`${chalk.green("[INFO]")} If these details are incorrect, execute "serverx list" to update instance details and try again`);
    console.log(`${chalk.green("[INFO]")} Attempting to connect...`);
    console.log("");

    await sshUtil(instanceToConnect.address, username.toString(), key, password.password, Number(flags.port));
  }

  async resolveHome(filepath: string): Promise<string | undefined> {
    const validFileExtensions = [".pem", ".ppk", ""];

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
  }
}
