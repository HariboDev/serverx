import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsModifyCommand extends Command {
  static description: string = `Modify a registered account
Modify a registered AWS or GCP account
`;

  static flags: FlagInput<any> = {};

  static args = [
    {
      name: "type",
      description: "Modify a registered AWS or GCP account",
      required: true,
      options: ["aws", "gcp"]
    }
  ];

  static examples: Array<string> = [
    "$ serverx accounts modify",
    "$ serverx accounts modify aws",
    "$ serverx accounts modify gcp"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(AccountsModifyCommand);
  }
}
