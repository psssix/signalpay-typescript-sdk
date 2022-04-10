import { IPublicKeyResponse } from "./contracts/response/IPublicKeyResponse";
import { IPaymentRequest } from "./contracts/request/IPaymentRequest";
import { IAuthResponse } from "./contracts/response/IAuthResponse";
import { IBaseResponse } from "./contracts/response/BaseResponse";
import { ActionResult } from "./contracts/ActionResult";
import { IPaymentMethodsResponse } from "./contracts/response/PaymentMethodsResponse";
import * as Fingerprint2 from "fingerprintjs2";
import { ICryptoPaymentRequest } from "./contracts/request/ICryptoPaymentRequest";

export class ApiClient {
  private readonly BaseUri: string;
  private Fingerprint: string | undefined;
  private XCorrelationId: string;

  constructor(baseUri: string) {
    this.BaseUri = baseUri;
    this.XCorrelationId = this.uuidv4();
    const _self = this;
    setTimeout(() => {
      Fingerprint2.get(components => {
        const values = components.map(component => {
          return component.value;
        });
        _self.Fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
      });
    }, 500);
  }

  public getPublicKey = (siteId: string): Promise<IPublicKeyResponse> => {
    return this.sendGetRequest<IPublicKeyResponse>("payments/public/key", {
      siteId
    });
  };

  public auth = (request: IPaymentRequest): Promise<IAuthResponse> => {
    request.browserFingerPrint = this.Fingerprint!;
    return this.sendPostRequest<IAuthResponse>("payments/public/auth", request);
  };

  public charge = (request: IPaymentRequest): Promise<IAuthResponse> => {
    request.browserFingerPrint = this.Fingerprint!;
    return this.sendPostRequest<IAuthResponse>(
      "payments/public/charge",
      request
    );
  };

  public cryptoAuth = (
    request: ICryptoPaymentRequest
  ): Promise<IAuthResponse> => {
    request.browserFingerPrint = this.Fingerprint!;
    return this.sendPostRequest<IAuthResponse>(
      "payments/cryptogram/auth",
      request
    );
  };

  public cryptoCharge = (
    request: ICryptoPaymentRequest
  ): Promise<IAuthResponse> => {
    request.browserFingerPrint = this.Fingerprint!;
    return this.sendPostRequest<IAuthResponse>(
      "payments/cryptogram/charge",
      request
    );
  };

  public getPaymentMethods = (
    siteId: string
  ): Promise<IPaymentMethodsResponse> => {
    return this.sendPostRequest<IPaymentMethodsResponse>(
      "payments/public/methods",
      { siteId },
      true
    );
  };

  private sendGetRequest = <T>(
    method: string,
    params: object | undefined
  ): Promise<T> => {
    let queryString: any = null;
    if (params != null) {
      queryString = Object.entries(params)
        .map(([key, val]) => `${key}=${encodeURIComponent(val as string)}`)
        .join("&");
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      if (queryString == null) {
        xhr.open("GET", this.BaseUri + "/" + method);
      } else {
        xhr.open("GET", this.BaseUri + "/" + method + "?" + queryString);
      }
      xhr.setRequestHeader("X-Correlation-ID", this.XCorrelationId);
      xhr.setRequestHeader("X-Request-ID", this.uuidv4());
      xhr.onload = () => {
        const response: T = JSON.parse(xhr.response);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  };

  private sendPostRequest = <T extends IBaseResponse>(
    method: string,
    body: any,
    ignoreActionResult: boolean = false
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", this.BaseUri + "/" + method);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("X-Correlation-ID", this.XCorrelationId);
      xhr.setRequestHeader("X-Request-ID", this.uuidv4());
      xhr.onload = () => {
        const response: T = JSON.parse(xhr.response);
        this.XCorellationHandler(response);
        if (
          xhr.status >= 200 &&
          xhr.status < 300 &&
          (response.actionResult === ActionResult.Approved ||
            response.actionResult === ActionResult.ThreeeDsRequired)
        ) {
          resolve(response);
        } else {
          if (xhr.status >= 200 && xhr.status < 300 && ignoreActionResult) {
            resolve(response);
          }
          if (xhr.status > 200 && xhr.status >= 300) {
            console.error("Service error occured", xhr.statusText);
          }
          reject(response);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(body));
    });
  };

  private XCorellationHandler = <T extends IBaseResponse>(response: T) => {
    if (
      response.actionResult === ActionResult.Approved ||
      ActionResult.Declined
    ) {
      this.XCorrelationId = this.uuidv4();
    }
  };

  private uuidv4 = () => {
    if ("crypto" in window && typeof crypto.getRandomValues === "function") {
      // tslint:disable-next-line: no-eval
      return eval("[1e7]+[-1e3]+[-4e3]+[-8e3]+[-1e11]").replace(
        /[018]/g,
        // tslint:disable-next-line: no-bitwise
        (c: number) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      // tslint:disable-next-line: no-bitwise
      const r = (Math.random() * 16) | 0;
      // tslint:disable-next-line: no-bitwise
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}
