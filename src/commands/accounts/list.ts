import { Command, Flags } from "@oclif/core";
import listAccounts from "../../list-accounts";

export default class AccountsList extends Command {
  static description: string = `List accounts
List registered AWS & GCP accounts
`;

  static flags = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts list"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsList);

    await listAccounts(this.config.configDir, flags.detail);
  }
}
