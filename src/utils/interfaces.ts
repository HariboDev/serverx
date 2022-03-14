export interface IConfigData {
  pemDir: string;
  accountCredentials: Array<IAccountCredentials>;
}

export interface IPemObject {
  pemDir: string;
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
  awsManaged: Array<IAwsManagedInstance>;
  selfManaged: Array<ISelfManagedInstance>;
}

export interface IAwsManagedInstance {
  name: string;
}

export interface ISelfManagedInstance {
  name: string;
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
