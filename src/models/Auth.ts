import { ModelUser } from "./User";

export class ModelAuth {
  primaryKeyAuth: ModelUser["primaryKeyUser"];
  referenceKeyUser: ModelUser["primaryKeyUser"];
  token: string;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    this.primaryKeyAuth = Math.random().toString(20).slice(2);
    this.referenceKeyUser = referenceKeyUser;
    this.token = Math.random().toString(20).slice(2);
  }
}
