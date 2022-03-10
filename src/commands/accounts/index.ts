import { Command, Flags, Help } from "@oclif/core";

export default class AccountsCommand extends Command {
  static description: string = `Display registered AWS & GCP accounts
Display registered AWS & GCP accounts
`;

  static args = [
    {
      name: "action",
      description: "List, register, remove or edit an account",
      required: true,
      options: ["list", "register", "remove", "edit"]
    }
  ];

  static flags = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts",
    "$ serverx accounts list",
    "$ serverx accounts register",
    "$ serverx accounts remove",
    "$ serverx accounts edit"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(AccountsCommand);
  }
}
