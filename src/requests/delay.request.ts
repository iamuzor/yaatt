import { Cache } from "../cache";
import { Request } from "./request";

export type DelayParams = {
  id: string;
  delay: number;
};

export class Delay extends Request {
  readonly name = "delay";
  readonly emoji = "⏳";

  constructor(
    private readonly params: DelayParams,
    private readonly cache: Cache
  ) {
    super(params.id);
  }

  execute(): Promise<Delay> {
    if (this.params.delay <= 0) {
      return Promise.resolve(this)
    }

    this._requestType = 'Delay'
    this._duration = `${this.params.delay} secs`
    this._statusCode = 'n/a'

    this.cache.save(this.params.id, this.params);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this);
      }, this.params.delay * 1000);
    });
  }
}
