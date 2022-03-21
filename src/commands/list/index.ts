import { Command, Help } from "@oclif/core";

export default class ListCommand extends Command {
  static description: string = `List Instances for AWS, GCP and self-managed servers
`;

  static args = [
    {
      name: "action",
      description: "List AWS, GCP and self-managed servers",
      required: true,
      options: ["aws", "gcp", "self"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx list",
    "$ serverx list aws",
    "$ serverx list gcp",
    "$ serverx list self"

  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(ListCommand);
  }
}
