import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsListCommand extends Command {
  static description: string = `List registered accounts
List registered AWS & GCP accounts
`;

  static flags: FlagInput<any> = {};

  static args = [
    {
      name: "type",
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
