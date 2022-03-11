
import chalk from "chalk";
const fs = require("fs");
const path = require("path");

export async function readJsonFile(jsonFile: string, filename: string): Promise<any> {
  let jsonData: any = {};

  try {
    jsonData = JSON.parse(fs.readFileSync(path.join(jsonFile, `${filename}.json`)));
    console.log(`${chalk.green("[INFO]")} ${filename[0].toUpperCase() + filename.slice(1)} file located`);
  } catch (error) {
    console.log(`${chalk.red("[ERROR]")} Unable to locate ${filename} file`);
    console.log(`${chalk.red("[REASON]")} ${error}`);
    return;
  }

  return jsonData;
}

export async function writeJsonFile(jsonFile: string, filename: string, data: string): Promise<any> {
  try {
    fs.writeFileSync(path.join(jsonFile, `${filename}.json`), data);
    console.log(`${chalk.green("[INFO]")} Successfully saved ${filename} data`);
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
