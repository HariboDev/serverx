import { Command, Flags } from "@oclif/core";
import Table from "cli-table3";
import chalk from "chalk";
import get from "../../utils/get";
import { IInstancesData } from "../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class ListCommand extends Command {
  static description = `Display AWS, GCP and self-managed servers
Gathers up AWS, GCP and self-managed servers and displays summaries in a table
`;

  static flags: FlagInput<any> = {
    region: Flags.string({
      char: "r",
      description: "Only get servers in a specific region(s)",
      multiple: true,
      default: "all",
      options: [
        "us-east-1",
        "us-east-2",
        "us-west-1",
        "us-west-2",
        "ap-south-1",
        "ap-northeast-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "ca-central-1",
        "eu-central-1",
        "eu-west-1",
        "eu-west-2",
        "eu-west-3",
        "eu-north-1",
        "sa-east-1"
      ]
    }),
    state: Flags.string({
      char: "s",
      description: "Only get servers of in a specific state(s)",
      multiple: true,
      default: "all",
      options: [
        "pending",
        "running",
        "stopping",
        "stopped",
        "shutting-down",
        "terminated"
      ]
    }),
    account: Flags.string({
      char: "a",
      description: "Only get servers from a specific account(s)",
      multiple: true,
      default: "all"
    }),
    managed: Flags.string({
      char: "m",
      description: "Only get servers under a specific management(s)",
      multiple: true,
      default: "all",
      options: [
        "aws",
        "self"
      ]
    }),
    "no-refresh": Flags.boolean({
      description: "Don't refresh the cache of known servers",
      default: false
    })
  };

  async run(): Promise<void> {
    const { flags }: any = await this.parse(ListCommand);

    const instancesData: IInstancesData | undefined = await get(flags, this.config);

    if (!instancesData) {
      console.log(chalk.red("[ERROR]") + " Unable to get AWS instances");
      return;
    }

    const table = new Table({
      head: [
        chalk.blueBright("Index"),
        chalk.blueBright("Name"),
        chalk.blueBright("Address"),
        chalk.blueBright("Key Pair"),
        chalk.blueBright("Username"),
        chalk.blueBright("State"),
        chalk.blueBright("Accessible"),
        chalk.blueBright("Location"),
        chalk.blueBright("Account"),
        chalk.blueBright("Managed By")
      ]
    });

    const managementChoice: Array<string> = flags.managed.toString() === "all" ? ["aws", "self"] : flags.managed.toString().split(",");

    for (const managed of managementChoice) {
      const instances: any = instancesData as any;
      for (const instance of instances[managed]) {
        let stateChalk;
        switch (instance.state) {
          case "running": {
            stateChalk = chalk.green(`${instance.state}`);
            break;
          }

          case "stopping": {
            stateChalk = chalk.yellow(`${instance.state}`);
            break;
          }

          case "pending": {
            stateChalk = chalk.yellow(`${instance.state}`);
            break;
          }

          case "Unknown": {
            stateChalk = chalk.grey(`${instance.state}`);
            break;
          }

          default: {
            stateChalk = chalk.red(`${instance.state}`);
          }
        }

        console.log(managed);
        table.push([
          (managed === "aws" ? instances[managed].indexOf(instance) : instances.aws.length + instances[managed].indexOf(instance)),
          (instance.name === "Unknown" ?
            chalk.grey(`${instance.name}`) :
            chalk.white(`${instance.name}`)
          ),
          (instance.address === "Unknown" ?
            chalk.grey(`${instance.address}`) :
            chalk.white(`${instance.address}`)
          ),
          (instance.keyPair === "Unknown" ?
            chalk.grey("Unknown") :
            (instance.keyPair ?
              chalk.white(`${instance.keyPair}`) :
              chalk.grey("None"))
          ),
          (instance.username === "Unknown" ?
            chalk.grey(`${instance.username}`) :
            chalk.white(`${instance.username}`)
          ),
          stateChalk,
          (instance.accessible === true ?
            chalk.green(`${instance.accessible}`) :
            (instance.accessible === false ?
              chalk.red(`${instance.accessible}`) :
              chalk.white(`${instance.accessible}`)
            )
          ),
          (instance.location === "Unknown" ?
            chalk.grey(`${instance.location}`) :
            chalk.white(`${instance.location}`)
          ),
          (instance.account === "Unknown" ?
            chalk.grey(`${instance.account}`) :
            chalk.white(`${instance.account}`)
          ),
          chalk.white(managed)
        ]);
      }
    }

    console.log(table.toString());
  }
}
