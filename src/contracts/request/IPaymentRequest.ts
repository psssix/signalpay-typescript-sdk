import { ICard } from "./Card";
import { IOrder } from "./IOrder";
import { ICustomer } from "./ICustomer";

export interface IPaymentRequest {
    card: ICard;
    domain: string;
    browserFingerPrint?: string;
    siteId: string;
    order: IOrder;
    customer: ICustomer;
}

export class PaymentRequest implements IPaymentRequest{
    domain: string;
    card: ICard;
    browserFingerPrint?: string;
    siteId: string;
    order: IOrder;
    customer: ICustomer;

    constructor(card: ICard, domain: string, siteId: string, order: IOrder, customer: ICustomer){
        this.domain = domain;
        this.card = card;
        this.siteId = siteId;
        this.order = order;
        this.customer = customer;
    }
}
