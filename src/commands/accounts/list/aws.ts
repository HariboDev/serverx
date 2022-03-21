import { Command, Flags } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";
import listAwsAccounts from "../../../utils/list-accounts/aws";

export default class AccountsListAwsCommand extends Command {
  static description: string = `List registered AWS accounts
List registered AWS accounts
`;

  static flags: FlagInput<any> = {
    detail: Flags.boolean({
      char: "d",
      description: "Display extra account details",
      default: false
    })
  };

  static examples: Array<string> = [
    "$ serverx accounts list aws",
    "$ serverx accounts list aws --detail"
  ];

  async run(): Promise<void> {
    const { flags }: any = await this.parse(AccountsListAwsCommand);

    await listAwsAccounts(this.config.configDir, flags.detail);
  }
}
