import { ActionResult } from "../ActionResult";

export interface IAuthResponse {
  paymentData: PaymentData;
  actionResult: ActionResult;
  mode: string;
  paymentId: number;
  threeDsPaReq?: ThreeDsPaReq;
}

export interface PaymentData {
  code: number;
  payerMessage: string;
  errorMessage: string;
}

export interface ThreeDsPaReq {
  acsUrl: string;
  md: string;
  paReq: string;
}
