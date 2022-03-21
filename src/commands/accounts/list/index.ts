import { Command, Help } from "@oclif/core";

export default class AccountsListCommand extends Command {
  static description: string = `List registered accounts
List registered AWS & GCP accounts
`;

  static args = [
    {
      name: "action",
      description: "List registered AWS or GCP accounts",
      required: true,
      options: ["aws", "gcp"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx accounts list",
    "$ serverx accounts list aws",
    "$ serverx accounts list gcp"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(AccountsListCommand);
  }
}
