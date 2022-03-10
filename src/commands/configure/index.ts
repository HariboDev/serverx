import { Command } from "@oclif/core";
const fs = require("fs");
const path = require("path");
import chalk from "chalk";
const inquirer = require("inquirer");
const axios = require("axios");

interface IConfigData {
  "pem Directory": string;
}

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
    if (fs.existsSync(this.config.configDir)) {
      return true;
    }

    try {
      fs.mkdirSync(this.config.configDir, { recursive: true });

      console.log(`${chalk.green("[INFO]")} Package directory created successfully`);
      return true;
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to create package directory`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
      return false;
    }
  }

  async createConfigFile(): Promise<void> {
    if (fs.existsSync(this.config.configDir)) {
      console.log(`${chalk.green("[INFO]")} Config directory located`);
    } else {
      try {
        fs.mkdirSync(this.config.configDir, { recursive: true });
        console.log(`${chalk.green("[INFO]")} Config directory created successfully`);
      } catch (error) {
        console.log(`${chalk.red("[ERROR]")} Unable to create config directory`);
        console.log(`${chalk.red("[REASON]")} ${error}`);
        return;
      }
    }

    if (fs.existsSync(path.join(this.config.configDir, "config.json"))) {
      try {
        console.log(`${chalk.green("[INFO]")} Config file located`);
        JSON.parse(fs.readFileSync(path.join(this.config.configDir, "config.json")));
      } catch (error) {
        console.log(`${chalk.red("[ERROR]")} Unable to read config file`);
        console.log(`${chalk.red("[REASON]")} ${error}`);
        return;
      }
    }

    const configData: IConfigData = await inquirer.prompt([{
      type: "input",
      name: "pemDirectory",
      message: "Default .pem directory",
      default: process.platform === "win32" ? "/ssh" : `${process.env.HOME}/.ssh`,
      validate: (value: string) => {
        if (process.platform !== "win32") {
          value = value.replace("~", process.env.HOME || "");
        }

        return fs.existsSync(value);
      }
    }]);

    try {
      fs.writeFileSync(path.join(this.config.configDir, "config.json"), JSON.stringify(configData));
      console.log(`${chalk.green("[INFO]")} Successfully saved config data`);
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to save config file`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
    }
  }

  async createDataFile(): Promise<void> {
    if (fs.existsSync(this.config.dataDir)) {
      console.log(`${chalk.green("[INFO]")} Data directory located`);
    } else {
      try {
        fs.mkdirSync(this.config.dataDir, { recursive: true });
        console.log(`${chalk.green("[INFO]")} Data directory created successfully`);
      } catch (error) {
        console.log(`${chalk.red("[ERROR]")} Unable to create data directory`);
        console.log(`${chalk.red("[REASON]")} ${error}`);
        return;
      }
    }

    let publicIP;

    try {
      const response = await axios.get("https://api.ipify.org");
      publicIP = response.data;
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to get public IP`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
      return;
    }

    const dataData = {
      IP: publicIP
    };

    try {
      fs.writeFileSync(path.join(this.config.dataDir, "data.json"), JSON.stringify(dataData));
      console.log(`${chalk.green("[INFO]")} Successfully saved data to data file`);
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to save data to data file`);
      console.log(`${chalk.red("[REASON]")} ${error}`);
      return;
    }

    if (!fs.existsSync(path.join(this.config.dataDir, "instances.json"))) {
      try {
        const instancesData = {
          awsManaged: [],
          selfManaged: []
        };

        fs.writeFileSync(path.join(this.config.dataDir, "instances.json"), JSON.stringify(instancesData));
        console.log(`${chalk.green("[INFO]")} Successfully saved data to instances file`);
      } catch (error) {
        console.log(`${chalk.red("[ERROR]")} Unable to save data to instances file`);
        console.log(`${chalk.red("[REASON]")} ${error}`);
      }
    }
  }
}
