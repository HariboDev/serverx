import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsCommand extends Command {
  static description: string = `Manage registered AWS & GCP accounts
List, register, deregister or modify registered AWS & GCP accounts
`;

  static flags: FlagInput<any> = {};

  static args = [
    {
      name: "action",
      description: "List, register, deregister or modify an account",
      required: true,
      options: ["list", "register", "deregister", "modify"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx accounts",
    "$ serverx accounts list",
    "$ serverx accounts register",
    "$ serverx accounts deregister",
    "$ serverx accounts modify"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(AccountsCommand);
  }
}
