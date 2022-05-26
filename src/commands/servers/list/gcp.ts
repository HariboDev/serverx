import { Command, Flags } from "@oclif/core";
import Table from "cli-table3";
import chalk from "chalk";
import { IInstancesData } from "../../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";
import getGCP from "../../../utils/get/gcp";
import { allGcpRegions } from "../../../utils/gcp-zones";

export default class ListCommandGCP extends Command {
  static description = `GCP 
  Gathers up GCP servers and displays summaries in a table
`;

  static flags: FlagInput<any> = {
    region: Flags.string({
      char: "r",
      description: "Only get servers in a specific regions(s)",
      multiple: true,
      default: "all",
      options: allGcpRegions
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
    "use-cache": Flags.boolean({
      description: "Use the local instances cache file",
      default: false
    })
  };

  async run(): Promise<void> {
    const { flags }: any = await this.parse(ListCommandGCP);

    const instancesData: IInstancesData | undefined = await getGCP(flags, this.config);

    if (!instancesData) {
      console.log(chalk.red("[ERROR]") + " Unable to get GCP instances");
      return;
    }

    const table = new Table({
      head: [
        chalk.blueBright("Index"),
        chalk.blueBright("Name"),
        chalk.blueBright("Address"),
        chalk.blueBright("State"),
        chalk.blueBright("Accessible"),
        chalk.blueBright("Location"),
        chalk.blueBright("Account"),
        chalk.blueBright("Managed By")
      ]
    });

    const instances: any = instancesData as any;

    for (const instance of instances.gcp) {
      let stateChalk;
      switch (instance.state) {
        case "RUNNING": {
          stateChalk = chalk.green(`${instance.state}`);
          break;
        }

        case "TERMINATED": {
          stateChalk = chalk.red(`${instance.state}`);
          break;
        }

        default: {
          stateChalk = chalk.red(`${instance.state}`);
        }
      }

      table.push([
        instances.gcp.indexOf(instance),
        instance.name,
        (instance.address === "Unknown" ?
          chalk.grey(`${instance.address}`) :
          chalk.white(`${instance.address}`)
        ),
        stateChalk,
        (instance.accessible === true ?
          chalk.green(`${instance.accessible}`) :
          (instance.accessible === false ?
            chalk.red(`${instance.accessible}`) :
            chalk.white(`${instance.accessible}`)
          )
        ),
        instance.location,
        instance.account,
        "GCP"
      ]);
    }

    console.log(table.toString());
  }
}
