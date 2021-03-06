import Compute, { InstancesClient } from "@google-cloud/compute";
import { Config } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces";
import chalk from "chalk";
import { allGcpRegions, getZones } from "../gcp-zones";
import { IConfigData, IGcpAccountCredentials, IInstance, IInstancesData } from "../interfaces";
import { isPortReachable, readJsonFile, writeJsonFile } from "../utils";

export default async function getGCP(flags: FlagInput<any>, config: Config): Promise<any> {
  const configData: IConfigData = await readJsonFile(config.configDir, "config");

  if (!configData) {
    return;
  }

  const instancesData: IInstancesData = await readJsonFile(config.dataDir, "instances");

  if (!instancesData) {
    return;
  }

  const accountsToSearch: Array<IGcpAccountCredentials> = flags.account.toString() === "all" ?
    configData.gcpAccounts : configData.gcpAccounts.filter((account: IGcpAccountCredentials) => {
      return flags.account.toString().split(",").includes(account.gcpAccountName);
    });

  if (JSON.parse(flags["use-cache"].toString())) {
    const instances: IInstancesData = {
      aws: [],
      gcp: instancesData.gcp.filter((instance: IInstance) => {
        return ((flags.region.toString() === "all" ||
          (flags.region.toString().includes(instance.location))) &&
          (flags.state.toString() === "all" ||
            flags.state.toString().split(",").includes(instance.state))
        );
      }),
      self: []
    };
    return instances;
  }

  console.log(`${chalk.green("[INFO]")} Gathering GCP managed instances`);

  for await (const account of accountsToSearch) {
    console.log(`${chalk.green("[INFO]")} Checking account: ${account.gcpAccountName}`);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = account.credentialsFile;

    flags.region.toString() === "all" ? instancesData.gcp = await listInstanceByZone(account.gcpProjectId, allGcpRegions) : instancesData.gcp = await listInstanceByZone(account.gcpProjectId, flags.region.toString().split(","));
  }

  const writeResponse: boolean = await writeJsonFile(config.dataDir, "instances", JSON.stringify(instancesData));

  if (!writeResponse) {
    return;
  }

  return instancesData;
}

async function listInstanceByZone(projectId: string, regions: string[]): Promise<any> {
  const instanceClient: InstancesClient = new Compute.InstancesClient();
  const instancesData: any = [];
  let ephermeralIP: string = "";
  let accessible: boolean = false;
  const zonesToSearch = getZones(regions);
  const searchedRegions: string[] = [];

  for await (const zone of zonesToSearch) {
    const inRegion = zone.replace("zones/", "").replace(/-\w$/, "");
    if (!searchedRegions.includes(inRegion)) {
      console.log(`${chalk.green("[INFO]")} Checking region: ${inRegion}`);
      searchedRegions.push(inRegion);
    }

    const instanceList = instanceClient.listAsync({
      project: projectId,
      zone: zone
    });

    for await (const instance of instanceList) {
      if (!instance.networkInterfaces || instance.networkInterfaces.length < 0) {
        return;
      }

      if (!instance.networkInterfaces[0].accessConfigs || instance.networkInterfaces[0].accessConfigs.length < 0) {
        ephermeralIP = "Unknown";
      } else if (instance.networkInterfaces[0].accessConfigs.length > 0 && instance.networkInterfaces[0].accessConfigs[0].natIP) {
        ephermeralIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
      } else {
        ephermeralIP = "Unknown";
      }

      if (ephermeralIP !== "Unknown") {
        accessible = await isPortReachable(22, { host: ephermeralIP, timeout: 1000 });
      }

      instancesData.push({
        name: instance.name,
        address: ephermeralIP,
        state: instance.status,
        accessible: accessible,
        location: zone.replace("zones/", "").replace(/-\w$/, ""),
        account: projectId
      });
    }
  }

  return instancesData;
}
