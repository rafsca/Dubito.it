import { ModelUser } from "./User";
interface InterfaceAd {
  primaryKeyAd: string;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  idOwner: ModelUser["primaryKeyUser"];
  urlPhoto: string;
  status: string;
  referenceKeyUserPurchase: string;
  category: string;
  address: string;
  phone: number;
}
export class ModelAd implements InterfaceAd {
  primaryKeyAd = Math.random().toString(20).slice(2);
  referenceKeyUserPurchase = "";
  createdAt = new Date();

  constructor(
    public title: InterfaceAd["title"],
    public description: string,
    public price: number,
    public idOwner: ModelUser["primaryKeyUser"],
    public urlPhoto: string,
    public status: string,
    public category: string,
    public address: string,
    public phone: number
  ) {}
}
