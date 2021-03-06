import { Command, Help } from "@oclif/core";

export default class AccountsDeregisterCommand extends Command {
  static description: string = `Deregister an account
Deregister an AWS or GCP account
`;

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
