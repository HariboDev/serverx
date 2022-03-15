import { Command, Flags } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";
import listAccounts from "../../utils/list-accounts";

export default class AccountsListCommand extends Command {
  static description: string = `List accounts
List registered AWS & GCP accounts
`;

  static flags: FlagInput<any> = {
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
    const { flags }: any = await this.parse(AccountsListCommand);

    await listAccounts(this.config.configDir, flags.detail);
  }
}
