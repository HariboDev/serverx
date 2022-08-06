import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsDeregisterCommand extends Command {
  static description: string = `Deregister an account
Deregister an AWS or GCP account
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
    "$ serverx accounts deregister",
    "$ serverx accounts deregister aws",
    "$ serverx accounts deregister gcp"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(AccountsDeregisterCommand);
  }
}
