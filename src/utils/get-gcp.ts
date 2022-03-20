const compute = require("@google-cloud/compute");
import chalk from "chalk";
import getZones from "./get-zones";
// import { isPortReachable, readJsonFile, writeJsonFile, getEnabledRegions, getCurrentIp } from "./utils";
// import { IConfigData, IInstancesData, IAccountCredentials, IInstance } from "./interfaces";
// import { FlagInput } from "@oclif/core/lib/interfaces";
// import { Config } from "@oclif/core";

export default async function getGCP(flags: any): Promise<void> {
  console.log(`${chalk.green("[INFO]")} Gathering GCP managed instances`);
  console.log(flags.region.toString().split(","));
  if (flags.region.toString() === "all") {
    console.log("hello");
  }

  flags.region.toString() === "all" ? listAllInstances("new-project-12365") : listInstanceByZone("new-project-12365", flags.region.toString().split(","));
}

async function listAllInstances(projectId: string): Promise<void> {
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
        }

        instancesData.push({ name: instance.name, location: zone, status: instance.status, address: ephermeralIP });
        // console.log(instancesData);
      }
    }
  }
}

async function listInstanceByZone(projectId: string, regions: string[]): Promise<void> {
  const instanceClient = new compute.InstancesClient();
  const instancesData: any = [];
  let ephermeralIP: string = "";
  console.log(regions);
  const zones = getZones(regions);
  console.log(zones);
  for await (const zone of zones) {
    const instanceList = instanceClient.listAsync({
      project: projectId,
      zone: zone
    });
    for await (const instance of instanceList) {
      if (instance.networkInterfaces[0].accessConfigs.length > 0) {
        ephermeralIP = instance.networkInterfaces[0].accessConfigs[0].natIP;
      }

      instancesData.push({ name: instance.name, location: zone, status: instance.status, address: ephermeralIP });
      // console.log(instancesData);
    }
  }
}
