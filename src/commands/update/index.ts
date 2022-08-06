import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class UpdateCommand extends Command {
  static description: string = `Update security group and firewall rules
Update security group and firewall rules within AWS and GCP
`;

  static flags: FlagInput<any> = {};

  static args = [
    {
      name: "type",
      description: "Update AWS or GCP rules",
      required: true,
      options: ["aws", "gcp"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx update",
    "$ serverx update aws",
    "$ serverx update gcp"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(UpdateCommand);
  }
}
