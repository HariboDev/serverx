import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class ListCommand extends Command {
  static description: string = `List servers
List AWS, GCP or self-managed servers
`;

  static flags: FlagInput<any> = {};

  static args = [
    {
      name: "type",
      description: "List AWS, GCP or self-managed servers",
      required: true,
      options: ["aws", "gcp", "self"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx servers list",
    "$ serverx servers list aws",
    "$ serverx servers list gcp",
    "$ serverx servers list self"

  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(ListCommand);
  }
}
