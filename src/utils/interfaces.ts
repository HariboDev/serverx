export interface IConfigData {
  keyDir: string;
  awsAccounts: Array<IAwsAccountCredentials>;
  gcpAccounts: Array<IGcpAccountCredentials>;
}

export interface IAwsAccountCredentials {
  awsAccountName: string;
  awsAccessKey: string;
  awsSecretAccessKey: string;
  needRole? : boolean;
  awsRole?: string;
}

export interface IGcpAccountCredentials {
  gcpAccountName: string;
  gcpProjectId: string;
  credentialsFile: string;
}

export interface IKeyObject {
  keyDir: string;
}

export interface IConfirmIpObject {
  confirm: boolean;
}

export interface IIpObject {
  ip: string;
}

export interface IDataData {
  ip: string;
}

export interface IInstancesData {
  aws: Array<IInstance>;
  gcp: Array<IInstance>;
  self: Array<IInstance>;
}

export interface IInstance {
  name: string;
  address: string;
  username: string;
  hasKeyPair?: boolean;
  keyPair?: string;
  state: string;
  accessible: string | boolean;
  location: string;
  account: string;
}

export interface IIPChange {
  newIp: string;
  oldIp?: string;
}
