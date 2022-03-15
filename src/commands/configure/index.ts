import { Command } from "@oclif/core";
const fs = require("fs");
const path = require("path");
import chalk from "chalk";
const inquirer = require("inquirer");
const axios = require("axios");
import { IConfigData, IConfirmIpObject, IDataData, IInstancesData, IIpObject, IPemObject } from "../../utils/interfaces";
import { createDir, readJsonFile, writeJsonFile } from "../../utils/utils";

export default class ConfigureCommand extends Command {
  static description: string = `Configure serverx
Add accounts and customise serverx
`;

  static examples: Array<string> = [
    "$ serverx configure"
  ];

  async run(): Promise<void> {
    if (await this.createDirectories()) {
      await this.createConfigFile();
      await this.createDataFile();
    }
  }

  async createDirectories(): Promise<boolean> {
    const createResponse: boolean = await createDir(this.config.configDir, "package");
    return createResponse;
  }

  async createConfigFile(): Promise<void> {
    const createConfigDirResponse: boolean = await createDir(this.config.configDir, "config");

    if (!createConfigDirResponse) {
      return;
    }

    let configData: IConfigData;

    if (fs.existsSync(path.join(this.config.configDir, "config.json"))) {
      configData = await readJsonFile(this.config.configDir, "config");

      if (!configData) {
        return;
      }

      configData.pemDir = await this.askForPemDirectory();
    } else {
      configData = {
        pemDir: await this.askForPemDirectory(),
        accountCredentials: []
      };
    }

    await writeJsonFile(this.config.configDir, "config", JSON.stringify(configData));
  }

  async createDataFile(): Promise<void> {
    const createDataDirResponse: boolean = await createDir(this.config.dataDir, "data");

    if (!createDataDirResponse) {
      return;
    }

    let publicIP: string;

    try {
      const response = await axios.get("https://api.ipify.org");
      publicIP = response.data;
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to get public IP`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
      return;
    }

    const confirmIp: IConfirmIpObject = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Public IP: ${publicIP}`,
        default: true
      }
    ]);

    const dataData: IDataData = {
      ip: confirmIp.confirm ? publicIP : await this.askForIp(publicIP)
    };

    const writeDataFileResponse: boolean = await writeJsonFile(this.config.dataDir, "data", JSON.stringify(dataData));

    if (!writeDataFileResponse) {
      return;
    }

    if (!fs.existsSync(path.join(this.config.dataDir, "instances.json"))) {
      const instancesData: IInstancesData = {
        aws: [],
        self: []
      };

      await writeJsonFile(this.config.dataDir, "instances", JSON.stringify(instancesData));
    }
  }

  async askForPemDirectory(): Promise<string> {
    const directoryObject: IPemObject = await inquirer.prompt([
      {
        type: "input",
        name: "pemDir",
        message: "Default .pem directory",
        default: process.platform === "win32" ? "/ssh" : `${process.env.HOME}/.ssh`,
        validate: (value: string) => {
          if (process.platform !== "win32") {
            value = value.replace("~", process.env.HOME || "");
          }

          return fs.existsSync(value);
        }
      }
    ]);

    return directoryObject.pemDir;
  }

  async askForIp(publicIp: string): Promise<string> {
    const ipObject: IIpObject = await inquirer.prompt([
      {
        type: "input",
        name: "ip",
        message: "Enter your public IP",
        default: publicIp,
        when: (data: any) => !data.confirm,
        validate: (value: string) => {
          const regExp = new RegExp(/^(?:\d{1,3}\.){3}\d{1,3}$/);
          if (regExp.test(value)) {
            return true;
          }

          return "Invalid IPv4 address";
        }
      }
    ]);

    return ipObject.ip;
  }
}
