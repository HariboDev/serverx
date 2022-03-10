import Table from "cli-table3";
import ConfigureCommand from "./commands/configure";

async function configure() {
  await ConfigureCommand.run();

  const table: Table.Table = new Table({
    head: [
      `Thanks for downloading serverx

To get started, execute 'serverx help' to view a full list of commands.

Documentation: https://serverx.haribodev.uk`
    ]
  });

  console.log();
  console.log(table.toString());
  console.log();
}

configure();
