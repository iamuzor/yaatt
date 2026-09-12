import { Cache } from "../cache";
import { ValueResolvers } from "../resolvers/value_resolver.factory";
import { Request } from "./request";

enum HttpRequestMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
}

export type HttpRequestParams = {
  id: string;
  url: string;
  method: HttpRequestMethod;
  headers: { [key: string]: unknown };
  body: { [key: string]: unknown };
  query: { [key: string]: unknown };
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

export class Http extends Request {
  readonly name = "http_request";
  readonly emoji = "🚀";

  constructor(
    private readonly params: HttpRequestParams,
    private readonly cache: Cache
  ) {
    super(params.id);
  }

  private getBody(): { [key: string]: any } | undefined {
    if (this.params.method.toLowerCase() == HttpRequestMethod.GET) {
      // GET methods have no body, hence returning undefined.
      return undefined;
    }

    const modified: { [key: string]: unknown } = {};

    for (const index in this.params.body) {
      modified[index] = ValueResolvers.init(this.cache).resolve(
        this.params.body[index]
      );
    }

    return modified;
  }

  private getURL(): string {
    return ValueResolvers.init(this.cache).resolve(this.params.url) as string;
  }

  private getHeaders(): { [key: string]: any } {
    if (!this.params?.headers) {
      return DEFAULT_HEADERS;
    }

    const headers: { [key: string]: any } = {};

    for (const header in this.params.headers) {
      headers[header] = ValueResolvers.init(this.cache).resolve(
        this.params.headers[header]
      );
    }

    return headers;
  }

  async execute(): Promise<Http> {
    const url = this.getURL();
    const method = this.params.method;
    const headers = this.getHeaders();
    const body = this.getBody();
    const startTime = performance.now()

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    this._requestType = method.toUpperCase()
    this._duration = `${((performance.now() - startTime) / 1000).toFixed(2)} secs` // in seconds
    this._statusCode = `${response.status}`

    this.cache.save(this.params.id, {
      ...await response.json(),
      __statusCode: response.status
    });

    return this
  }
}
