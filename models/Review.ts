import { ModelUser } from "./User";
import { ModelAd } from "./Ad";

export class ModelReview {
  primaryKeyReview: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  title: string;
  rating: number;
  description: string;
  date: Date;
  referenceKeyAd: ModelAd["primaryKeyAd"];

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"], title: string, rating: number, description: string, referenceKeyAd: ModelAd["primaryKeyAd"]) {
    this.primaryKeyReview = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.title = title;
    this.rating = rating;
    this.description = description;
    this.date = new Date();
    this.referenceKeyAd = referenceKeyAd;
  }
}
