import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class ServersCommand extends Command {
  static description: string = `List servers
List, add, remove or modify servers
`;

  static flags: FlagInput<any> = {};

  static args = [
    {
      name: "action",
      description: "Add, remove or modify an account",
      required: true,
      options: ["list", "add", "remove", "modify"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx servers",
    "$ serverx servers list",
    "$ serverx servers add",
    "$ serverx servers remove",
    "$ serverx servers modify"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(ServersCommand);
  }
}
