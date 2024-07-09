import { ModelUser } from "./User";

export class ModelDevice {
  primaryKey: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  idDevice: number;
  deviceName: string | number;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"], device: ModelDevice["idDevice"]) {
    this.primaryKey = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.idDevice = device;
    this.deviceName = device;
  }
}
