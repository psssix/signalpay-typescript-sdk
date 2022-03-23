import { IBaseResponse } from "./BaseResponse";

export interface IPublicKeyResponse extends IBaseResponse {
  pk: string;
  pkId: string;
  siteId: string;
}
