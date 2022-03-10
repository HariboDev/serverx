import * as AWS from "aws-sdk";
const fs = require("fs");
const path = require("path");
const mockedEnv = require("mocked-env");
//import * as mockedEnv from "mocked-env";
import axios from "axios";
import chalk from "chalk";
import isReachable from "./is-reachable";

interface IConfigData {
    pemDir?: string;
    accountCredentials?: Array<IAccountCredentials>;
}
interface IAccountCredentials {
    awsAccountName: string;
    awsAccessKey: string;
    awsSecretAccessKey: string;
    awsRole?: string;
}

export default function get(flags: any, config: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const instancesData = {
      awsManaged: [] as any,
      selfManaged: [] as any
    };
    let configData: IConfigData = {};

    try {
      configData = JSON.parse(fs.readFileSync(path.join(config.configDir, "config.json")));
      console.log(`${chalk.green("[INFO]")} Config file located`);
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to locate config file`);
      reject(error);
      return;
    }

    let selfManagedInstances = [];

    try {
      selfManagedInstances = JSON.parse(fs.readFileSync(path.join(config.dataDir, "instances.json"))).selfManaged || [];
      console.log(`${chalk.green("[INFO]")} Data file located`);
    } catch {
      selfManagedInstances = [];
      console.log(`${chalk.red("[ERROR]")} Unable to locate data file`);
      // reject(error)
      // return
    }

    if (("accountCredentials" in configData)) {
      if (flags.region === "all") {
        flags.region = ["us-east-1",
          "us-east-2",
          "us-west-1",
          "us-west-2",
          "ap-south-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-southeast-1",
          "ap-southeast-2",
          "ca-central-1",
          "eu-central-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "eu-north-1",
          "sa-east-1"];
      }

      let params = {};

      params = flags.state === "all" ? {
        Filters: [{
          Name: "instance-state-name",
          Values: ["pending", "running", "stopping", "shutting-down", "stopped", "terminated"]
        }]
      } : {
        Filters: [{
          Name: "instance-state-name",
          Values: flags.state
        }]
      };

      if (flags.managed === "all" || flags.managed.includes("aws")) {
        console.log(`${chalk.green("[INFO]")} Gathering AWS managed instances`);

        for (const account of configData?.accountCredentials || []) {
          if (flags.account === "all") {
            console.log(`${chalk.green("[INFO]")} Checking account: ${account.awsAccountName}`);
          } else if (flags.account.includes(account.awsAccountName)) {
            console.log(`${chalk.green("[INFO]")} Checking account: ${account.awsAccountName}`);
          } else {
            console.log(`${chalk.yellow("[INFO]")} Skipping account: ${account.awsAccountName}`);
            continue;
          }

          for await (const region of flags.region) {
            console.log(`${chalk.green("[INFO]")} Checking region: ${region}`);

            let roleCredentials;

            if ("awsRole" in account) {
              const stsParams: AWS.STS.AssumeRoleRequest = {
                RoleArn: account.awsRole as string,
                RoleSessionName: "aws-ec2-profiles"
              };

              const restore = mockedEnv({
                AWS_ACCESS_KEY_ID: account.awsAccessKey,
                AWS_SECRET_ACCESS_KEY: account.awsSecretAccessKey
              }); 

              const creds = new AWS.EnvironmentCredentials("AWS");

              const sts: AWS.STS = new AWS.STS({
                credentials: creds,
                region: region
              });

              roleCredentials = await sts.assumeRole(stsParams).promise()
                .then((data: AWS.STS.AssumeRoleResponse) => {
                  return data;
                }).catch(() => {});

              if (!roleCredentials) {
                console.log(`${chalk.red("ERROR")} Unable to get role credentials for ${region}`);
                continue;
              }

              restore();
            }

            const ec2: AWS.EC2 = "awsRole" in account && roleCredentials ? new AWS.EC2({
              accessKeyId: roleCredentials.Credentials?.AccessKeyId as string,
              secretAccessKey: roleCredentials.Credentials?.SecretAccessKey as string,
              sessionToken: roleCredentials.Credentials?.SessionToken as string,
              region: region
            }) : new AWS.EC2({
              accessKeyId: account.awsAccessKey,
              secretAccessKey: account.awsSecretAccessKey,
              region: region
            });

            try {
              await ec2.describeInstances(params).promise()
                .then(async (data: any) => {
                  await Promise.all(data.Reservations.map(async (instance: any) => {
                    let name;
                    let username;
                    let isAccessible: boolean = false;

                    await ec2.describeImages({ ImageIds: [instance.Instances[0].ImageId] }).promise()
                      .then((data: any) => {
                        if (data.Images[0].PlatformDetails.includes("Linux")) {
                          if (data.Images[0].ImageLocation.includes("ubuntu")) {
                            username = "ubuntu";
                          } else if (data.Images[0].ImageLocation.includes("CentOS")) {
                            username = "centos";
                          } else {
                            username = "ec2-user";
                          }
                        } else {
                          username = "Administrator";
                        }
                      })
                      .catch((error: any) => {
                        return error;
                      });

                    await Promise.all(instance.Instances[0].SecurityGroups.map(async (securityGroup: any) => {
                      await ec2.describeSecurityGroups({ GroupIds: [securityGroup.GroupId] }).promise()
                        .then(async (data: any) => {
                          await Promise.all(data.SecurityGroups[0].IpPermissions.map(async (ipPerms: any) => {
                            if (ipPerms.IpProtocol === "-1" || ipPerms.FromPort === 22 || ipPerms.ToPort === 22) {
                              let ipAddress;

                              try {
                                const response = await axios.get("https://api.ipify.org");
                                ipAddress = response.data;
                              } catch (error) {
                                reject(error);
                              }

                              if (ipPerms.IpRanges[0].CidrIp === ipAddress + "/32" || ipPerms.IpRanges[0].CidrIp === "0.0.0.0/0") {
                                isAccessible = instance.Instances[0].State.Name === "running";
                              } else if (isAccessible !== true) {
                                isAccessible = false;
                              }
                            } else if (isAccessible !== true) {
                              isAccessible = false;
                            }
                          }));
                        })
                        .catch((error: any) => {
                          reject(error);
                        });
                    }));

                    try {
                      name = instance.Instances[0].Tags[0].Value;
                    } catch {
                      name = "N/A";
                    }

                    instancesData.awsManaged.push({
                      Name: name || "N/A",
                      Address: instance.Instances[0].PublicIpAddress || "N/A",
                      "Key Pair": instance.Instances[0].KeyName || "N/A",
                      Username: username || "N/A",
                      State: instance.Instances[0].State.Name || "N/A",
                      Accessible: isAccessible,
                      Location: region,
                      Account: account.awsAccountName
                    });
                  }));
                })
                .catch((error: any) => {
                  reject(error);
                });
            } catch (error) {
              reject(error);
            }
          }
        }
      }
    }

    if (selfManagedInstances.length > 0) {
      if (flags.managed.includes("self") || flags.managed.includes("all")) {
        console.log(`${chalk.green("[INFO]")} Gathering Self managed instances`);
      }

      await Promise.all(selfManagedInstances.map(async (instance: any) => {
        const instanceData = {
          Name: instance.Name,
          Address: instance.Address,
          "Key Pair": instance["Key Pair"],
          Username: instance.Username,
          State: instance.State,
          Accessible: instance.State,
          Location: instance.Location,
          Account: instance.Account
        };

        instanceData.Accessible = await isReachable(22, { host: instance.Address as string, timeout: 1000 });

        instancesData.selfManaged.push(instanceData);
      }));
    }

    try {
      fs.writeFileSync(path.join(config.dataDir, "instances.json"), JSON.stringify(instancesData));
      console.log(`${chalk.green("[INFO]")} Instances gathered`);
      resolve(instancesData);
    } catch (error) {
      console.log(`${chalk.red("[ERROR]")} Unable to save instance data locally`);
      reject(error);
    }
  });
}

