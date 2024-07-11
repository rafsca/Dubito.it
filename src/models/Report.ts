import { ModelUser } from "./User";
import { ModelAd } from "./Ad";

export class ModelReport {
  primaryKeyReport: string;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  description: string;
  title: string;
  referenceKeyAd: ModelAd["primaryKeyAd"];
  closed: boolean;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"], referenceKeyAd: ModelAd["primaryKeyAd"], title: string, description: string) {
    this.primaryKeyReport = Math.random().toString(20).slice(2);
    this.referenceKeyUser = referenceKeyUser;
    this.description = description;
    this.title = title;
    this.referenceKeyAd = referenceKeyAd;
    this.closed = false;
  }
}
