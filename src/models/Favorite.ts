import { ModelUser } from "./User";
import { ModelAd } from "./Ad";

export class ModelFavorite {
  primaryKeyFavorite: string;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  referenceKeyAd: ModelAd["primaryKeyAd"];

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"], referenceKeyAd: ModelAd["primaryKeyAd"]) {
    this.primaryKeyFavorite = Math.random().toString(20).slice(2);
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyAd = referenceKeyAd;
  }
}
