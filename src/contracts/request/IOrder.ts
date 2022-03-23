export interface IOrder {
  amount: number;
  currency: string;
  id: string;
  data: string;
  description: string;
}

export class Order {
  amount: number;
  currency: string;
  id: string;
  data: string;
  description: string;

  constructor(order: IOrder) {
    this.amount = order.amount;
    this.currency = order.currency;
    this.id = order.id;
    this.data = order.data;
    this.description = order.description;
  }
}
