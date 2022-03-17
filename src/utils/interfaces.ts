export interface IConfigData {
  keyDir: string;
  accountCredentials: Array<IAccountCredentials>;
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

export interface IAccountCredentials {
  awsAccountName: string;
  awsAccessKey: string;
  awsSecretAccessKey: string;
  awsRole?: string;
}

export interface IIPChange {
  newIp: string;
  oldIp?: string;
}
