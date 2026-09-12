import { Cache } from "../cache";
import { Delay, DelayParams } from "./delay.request";
import { Http, HttpRequestParams } from "./http.request";
import { Request } from "./request";

export type RequestsParams = {
  [key: string]: HttpRequestParams | DelayParams | unknown;
};

export class Requests {
  constructor(
    private readonly requests: RequestsParams,
    private readonly cache: Cache
  ) {}

  private isHttpRequest(request: unknown): request is HttpRequestParams {
    return (
      typeof request === "object" && !!request && Object.hasOwn(request, "url")
    );
  }

  private isDelayRequest(request: unknown): request is DelayParams {
    return (
      typeof request === "object" &&
      !!request &&
      Object.hasOwn(request, "delay")
    );
  }

  init(): Request[] {
    return Object.keys(this.requests)
      .map((id) => {
        const request = { ...this.requests[id], id };

        if (this.isHttpRequest(request)) {
          return new Http(request, this.cache);
        }

        if (this.isDelayRequest(request)) {
          return new Delay(request, this.cache);
        }

        throw new Error(`Unsupported request type: "${request}".`);
      })
      .filter((request) => !!request);
  }
}
