
import chalk from "chalk";
const fs = require("fs");
const path = require("path");
import * as net from "net";
import * as AWS from "aws-sdk";
import axios from "axios";
import { IAccountCredentials, IDataData, IIPChange } from "./interfaces";

export async function readJsonFile(dir: string, filename: string): Promise<any> {
  let jsonData: any = {};

  try {
    jsonData = JSON.parse(fs.readFileSync(path.join(dir, `${filename}.json`)));
    console.log(`${chalk.green("[INFO]")} Located ${filename} file`);
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to locate ${filename} file`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
    return;
  }

  return jsonData;
}

export async function writeJsonFile(dir: string, filename: string, data: string): Promise<boolean> {
  try {
    fs.writeFileSync(path.join(dir, `${filename}.json`), data);
    console.log(`${chalk.green("[INFO]")} Successfully saved to ${filename} file`);
    return true;
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to save ${filename} file`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
    return false;
  }
}

export async function validateIndex(input: string, upperBound: number): Promise<string | boolean> {
  if (input.trim() === "") {
    return "Index is required";
  }

  try {
    const intInput: number = Number(input);

    if (Number.isNaN(input) || !Number.isInteger(intInput)) {
      return "Index must be an integer";
    }

    if (intInput < 0 || intInput > upperBound) {
      return `Index must be between 0 and ${upperBound}`;
    }
  } catch {
    return "Invalid index";
  }

  return true;
}

export async function createDir(dir: string, dirType: string): Promise<boolean> {
  if (fs.existsSync(dir)) {
    console.log(`${chalk.green("[INFO]")} ${dirType[0].toUpperCase() + dirType.slice(1)} directory located`);
    return true;
  }

  try {
    fs.mkdirSync(dir, { recursive: true });

    console.log(`${chalk.green("[INFO]")} ${dirType[0].toUpperCase() + dirType.slice(1)} directory created successfully`);
    return true;
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to create ${dirType} directory`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
    return false;
  }
}

export async function isPortReachable(port: number, { host, timeout = 1000 }: { host: string, timeout: number }): Promise<boolean> {
  if (typeof host !== "string") {
    throw new TypeError("Specify a `host`");
  }

  const promise = new Promise(((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once("error", onError);
    socket.once("timeout", onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve("Done");
    });
  }));

  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}

export async function getEnabledRegions(account: IAccountCredentials): Promise<Array<string>> {
  const ec2: AWS.EC2 = new AWS.EC2({
    accessKeyId: account.awsAccessKey,
    secretAccessKey: account.awsSecretAccessKey,
    region: "us-east-1"
  });

  try {
    const regionsResponse: AWS.EC2.DescribeRegionsResult = await ec2.describeRegions().promise();

    if (!regionsResponse.Regions) {
      return [];
    }

    const regions: Array<string> = await Promise.all(regionsResponse.Regions.map((region: AWS.EC2.Region) => {
      return region.RegionName || "";
    }));

    return regions.filter((region: string) => {
      return region !== "";
    });
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to get regions`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
    return [];
  }
}

export async function getCurrentIp(): Promise<string | undefined> {
  try {
    const ipResponse = await axios.get("https://api.ipify.org");
    return ipResponse.data;
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to get current IP`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
  }
}

export async function checkIpChanged(dataData: IDataData): Promise<IIPChange | undefined> {
  const newIp: string | undefined = await getCurrentIp();

  if (!newIp) {
    return;
  }

  if (dataData.ip === newIp) {
    console.log(`${chalk.green("[INFO]")} No IP change detected`);
    console.log(`${chalk.green("[INFO]")} Current IP: ${newIp}`);

    return {
      newIp: newIp
    };
  }

  const oldIp = dataData.ip;
  dataData.ip = newIp;

  console.log(`${chalk.green("[INFO]")} IP change detected`);
  console.log(`${chalk.green("[INFO]")} Old IP: ${oldIp}`);
  console.log(`${chalk.green("[INFO]")} New IP: ${newIp}`);

  return {
    newIp: newIp,
    oldIp: oldIp
  };
}
