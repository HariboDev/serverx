import { Command, Flags } from "@oclif/core";
import Table from "cli-table3";
import chalk from "chalk";
import getSelf from "../../../utils/get/self";
import { IInstancesData } from "../../../utils/interfaces";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class ListCommandSelf extends Command {
  static description = `Display self-managed servers
Gathers up self-managed servers and displays summaries in a table
`;

  static flags: FlagInput<any> = {
    region: Flags.string({
      char: "r",
      description: "Only get servers in a specific region(s)",
      multiple: true,
      default: "all"
    }),
    "use-cache": Flags.boolean({
      description: "Use the local instances cache file",
      default: false
    })
  };

  async run(): Promise<void> {
    const { flags }: any = await this.parse(ListCommandSelf);

    const instancesData: IInstancesData | undefined = await getSelf(flags, this.config);

    if (!instancesData) {
      console.log(chalk.red("[ERROR]") + " Unable to get Self Managed instances");
      return;
    }

    const table = new Table({
      head: [
        chalk.blueBright("Index"),
        chalk.blueBright("Name"),
        chalk.blueBright("Address"),
        chalk.blueBright("Key Pair"),
        chalk.blueBright("Username"),
        chalk.blueBright("Accessible"),
        chalk.blueBright("Location"),
        chalk.blueBright("Managed By")
      ]
    });

    const instances: any = instancesData as any;
    for (const instance of instances.self) {
      table.push([
        (instances.self.indexOf(instance)),
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
        chalk.white("Self")
      ]);
    }

    console.log(table.toString());
  }
}
