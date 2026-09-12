export abstract class Request {
  abstract readonly name: string;
  abstract readonly emoji: string;
  protected _duration: string = '';
  protected _requestType: string = '';
  protected _statusCode: string = '';

  constructor(protected readonly _id: string) { }

  abstract execute(): Request | Promise<Request>;

  get id(): string {
    return this._id
  }

  get duration(): string | undefined {
    return this._duration
  }

  get requestType(): string | undefined {
    return this._requestType
  }

  get statusCode(): string | undefined {
    return this._statusCode
  }
}
