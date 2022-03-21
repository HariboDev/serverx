const compute = require("@google-cloud/compute");
import chalk from "chalk";
import getZones from "./get-zones";
import { IInstancesData } from "./interfaces";
import { isPortReachable } from "./utils";
// import { isPortReachable, readJsonFile, writeJsonFile, getEnabledRegions, getCurrentIp } from "./utils";
// import { IConfigData, IInstancesData, IAccountCredentials, IInstance } from "./interfaces";
// import { FlagInput } from "@oclif/core/lib/interfaces";
// import { Config } from "@oclif/core";

export default async function getGCP(flags: any): Promise<any> {
  console.log(`${chalk.green("[INFO]")} Gathering GCP managed instances`);
  console.log(flags.region.toString().split(","));
  if (flags.region.toString() === "all") {
    console.log("hello");
  }

  let instancesList: any = [];
  let instances: any = [];
  instancesList.self = []
  instancesList.gcp = []
  flags.region.toString() === "all" ? instances = await listAllInstances("new-project-12365") : instances = await listInstanceByZone("new-project-12365", flags.region.toString().split(","));
  instancesList.gcp = [...instancesList.gcp, ...instances]
  console.log(instancesList)
  return instancesList;
}

async function listAllInstances(projectId: string): Promise<any> {
  const instanceClient = new compute.InstancesClient();
  const instancesData: any = [];
  let ephermeralIP: string = "";
  const instanceList = instanceClient.aggregatedListAsync({
    project: projectId,
    maxResult: 5
  });
  for await (const [zone, instancesObject] of instanceList) {
    const instances = instancesObject.instances;

    if (instances && instances.length > 0) {
      for (const instance of instances) {
        if (instance.networkInterfaces[0].accessConfigs.length > 0) {
          ephermeralIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
        } else {
          ephermeralIP = "Unknown"
        }

        const accessible: boolean = await isPortReachable(22, { host: instance.address, timeout: 1000 });
        instancesData.push({ name: instance.name, address: ephermeralIP, state: instance.status, location: zone, accessible: accessible });
      }
    }
  }

  return instancesData;
}

async function listInstanceByZone(projectId: string, regions: string[]): Promise<any> {
  const instanceClient = new compute.InstancesClient();
  const instancesData: any = [];
  let ephermeralIP: string = "";
  const zones = getZones(regions);
  for await (const zone of zones) {
    const instanceList = instanceClient.listAsync({
      project: projectId,
      zone: zone
    });
    for await (const instance of instanceList) {
      console.log(instance);
      if (instance.networkInterfaces[0].accessConfigs.length > 0) {
        ephermeralIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
      }

      const accessible: boolean = await isPortReachable(22, { host: instance.address, timeout: 1000 });
      instancesData.push({ name: instance.name, address: ephermeralIP, state: instance.status, location: zone, accessible: accessible });
      // console.log(instancesData);
    }
  }

  return instancesData;
}
