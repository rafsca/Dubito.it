import { ModelUser } from "./User";
import { ModelAd } from "./Ad";

export class ModelFavorite {
  primaryKeyFavorite: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  referenceKeyAd: ModelAd["primaryKeyAd"];

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"], referenceKeyAd: ModelAd["primaryKeyAd"]) {
    this.primaryKeyFavorite = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyAd = referenceKeyAd;
  }
}
