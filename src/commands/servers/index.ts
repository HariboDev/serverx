import { Command, Help } from "@oclif/core";

export default class ServersCommand extends Command {
  static description: string = `Manage self-managed servers
Add, remove or modify self-managed servers
`;

  static args = [
    {
      name: "action",
      description: "Add, remove or modify an account",
      required: true,
      options: ["add", "remove", "modify"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx servers",
    "$ serverx servers add",
    "$ serverx servers remove",
    "$ serverx servers modify"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(ServersCommand);
  }
}
