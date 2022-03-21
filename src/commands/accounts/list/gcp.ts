import { Command } from "@oclif/core";
import listGcpAccounts from "../../../utils/list-accounts/gcp";

export default class AccountsListGcpCommand extends Command {
  static description: string = `List registered AWS accounts
List registered AWS accounts
`;

  static examples: Array<string> = [
    "$ serverx accounts list gcp"
  ];

  async run(): Promise<void> {
    await listGcpAccounts(this.config.configDir);
  }
}
