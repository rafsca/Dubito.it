import { ModelUser } from "./User";

export class ModelAd {
  primaryKeyAd: string;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  idOwner: ModelUser["primaryKeyUser"];
  urlPhoto: string;
  status: string;
  referenceKeyUserPurchase: ModelUser["primaryKeyUser"];
  category: string;
  address: string;
  phone: number;

  constructor(
    title: string,
    description: string,
    price: number,
    idOwner: ModelUser["primaryKeyUser"],
    urlPhoto: string,
    status: string,
    category: string,
    address: string,
    phone: number
  ) {
    this.primaryKeyAd = Math.random().toString();
    this.title = title;
    this.description = description;
    this.price = price;
    this.createdAt = new Date();
    this.idOwner = idOwner;
    this.urlPhoto = urlPhoto;
    this.status = status;
    this.referenceKeyUserPurchase = 0;
    this.category = category;
    this.address = address;
    this.phone = phone;
  }
}
