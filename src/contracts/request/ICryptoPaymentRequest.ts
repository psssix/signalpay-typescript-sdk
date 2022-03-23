import { IOrder } from "./IOrder";
import { ICustomer } from "./ICustomer";

export interface ICryptoPaymentRequest {
  onlinePaymentCryptogram: string;
  domain: string;
  browserFingerPrint?: string;
  siteId: string;
  order: IOrder;
  customer: ICustomer;
}

export class PaymentRequest implements ICryptoPaymentRequest {
  onlinePaymentCryptogram: string;
  domain: string;
  browserFingerPrint?: string;
  siteId: string;
  order: IOrder;
  customer: ICustomer;

  constructor(
    onlinePaymentCryptogram: string,
    domain: string,
    siteId: string,
    order: IOrder,
    customer: ICustomer
  ) {
    this.onlinePaymentCryptogram = onlinePaymentCryptogram;
    this.domain = domain;
    this.siteId = siteId;
    this.order = order;
    this.customer = customer;
  }
}
