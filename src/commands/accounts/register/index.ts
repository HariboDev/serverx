import { Command, Help } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";

export default class AccountsRegisterCommand extends Command {
  static description: string = `Register an account
Register an AWS or GCP account
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
    "$ serverx accounts register",
    "$ serverx accounts register aws",
    "$ serverx accounts register gcp"
  ];

  async run(): Promise<void> {
    const help = new Help(this.config);
    await help.showCommandHelp(AccountsRegisterCommand);
  }
}
