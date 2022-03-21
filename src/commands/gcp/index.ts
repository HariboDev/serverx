import { Command, Flags } from "@oclif/core";
import Table from "cli-table3";
import chalk from "chalk";
import { IInstancesData } from "../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";
import getGCP from "../../utils/get-gcp";

export default class ListCommandGCP extends Command {
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
        "asia-east1",
        "asia-east2",
        "asia-northeast1",
        "asia-northeast2",
        "asia-northeast3",
        "asia-south1",
        "asia-south2",
        "asia-southeast1",
        "asia-southeast2",
        "australia-southeast1",
        "europe-central2",
        "europe-north1",
        "europe-west1",
        "europe-west2",
        "europe-west3",
        "europe-west4",
        "europe-west6",
        "northamerica-northeast1",
        "northamerica-northeast2",
        "southamerica-east1",
        "southamerica-west1",
        "us-central1",
        "us-east1",
        "us-east4",
        "us-west1",
        "us-west2",
        "us-west3",
        "us-west4"
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
        "gcp",
        "self"
      ]
    }),
    "no-refresh": Flags.boolean({
      description: "Don't refresh the cache of known servers",
      default: false
    })
  };

  async run(): Promise<void> {
    const { flags }: any = await this.parse(ListCommandGCP);

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
    const managementChoice: Array<string> = flags.managed.toString() === "all" ? ["gcp", "self"] : flags.managed.toString().split(",");

    const instances = await getGCP(flags);
    console.log(instances)
    for (const managed of managementChoice) {
      for (const instance of instances[managed]) {
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
          (managed === "gcp" ? instances[managed].indexOf(instance): instances.gcp.length + instances[managed].indexOf(instance)),
          instance.name,
          (instance.address === "Unknown" ?
            chalk.grey(`${instance.address}`) :
            chalk.white(`${instance.address}`)
          ),
          "",
          "",
          stateChalk,
          (instance.accessible === true ?
            chalk.green(`${instance.accessible}`) :
            (instance.accessible === false ?
              chalk.red(`${instance.accessible}`) :
              chalk.white(`${instance.accessible}`)
            )
          ),
          instance.location,
          "",
          managed
        ]);
      }
    }
    console.log(table.toString());
  }
}
