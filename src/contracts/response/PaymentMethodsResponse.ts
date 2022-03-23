import { IBaseResponse } from "./BaseResponse";

export interface IApplePay {
  isAvailable: boolean;
  paymentMethods: string[];
  allowedCardNetworks: string[];
}

export interface IGooglePay {
  isAvailable: boolean;
  paymentMethods: string[];
  allowedCardNetworks: string[];
}

export interface ISamsungPay {
  isAvailable: boolean;
  paymentMethods: string[];
  allowedCardNetworks: string[];
}

export interface IPaymentMethodsResponse extends IBaseResponse {
  name: string;
  domain: string;
  card: boolean;
  isCharity: boolean;
  environment: string;
  applePay: IApplePay;
  googlePay: IGooglePay;
  samsungPay: ISamsungPay;
  secureBarLogos: string[];
}
