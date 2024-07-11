import { ModelUser } from "./User";

export class ModelDevice {
  primaryKey: string;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  idDevice: number;
  deviceName: string | number;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"], device: ModelDevice["idDevice"]) {
    this.primaryKey = Math.random().toString(20).slice(2);
    this.referenceKeyUser = referenceKeyUser;
    this.idDevice = device;
    this.deviceName = device;
  }
}
