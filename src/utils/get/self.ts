import { Config } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";
import chalk from "chalk";
import { isPortReachable, readJsonFile } from "../utils";
import { IConfigData, IInstance, IInstancesData } from "../interfaces";

export default async function getSelf(flags: FlagInput<any>, config: Config): Promise<any> {
  const configData: IConfigData = await readJsonFile(config.configDir, "config");

  if (!configData) {
    return;
  }

  const instancesData: IInstancesData = await readJsonFile(config.dataDir, "instances");

  if (!instancesData) {
    return;
  }

  if (JSON.parse(flags["use-cache"].toString())) {
    const instances: IInstancesData = {
      self: instancesData.self.filter((instance: IInstance) => {
        return (flags.region.toString() === "all" ||
        (flags.region.toString().includes(instance.location)));
      }),
      aws: [],
      gcp: []
    };
    return instances;
  }

  console.log(`${chalk.green("[INFO]")} Gathering self managed instances`);

  const selfManagedInstances: Array<IInstance> = instancesData.self;
  instancesData.self = [];

  for await (const instance of selfManagedInstances) {
    const instanceData = {
      name: instance.name,
      address: instance.address,
      keyPair: instance.keyPair,
      username: instance.username,
      state: instance.state,
      accessible: instance.accessible,
      location: instance.location,
      account: instance.account
    };

    instanceData.accessible = await isPortReachable(22, { host: instance.address, timeout: 1000 });
    instancesData.self.push(instanceData);
  }

  return instancesData;
}
