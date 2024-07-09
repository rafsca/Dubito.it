import { ModelUser } from "./User";

export class ModelAuth {
  primaryKeyAuth: ModelUser["primaryKeyUser"];
  referenceKeyUser: ModelUser["primaryKeyUser"];
  token: number;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    this.primaryKeyAuth = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.token = Math.random();
  }
}
