import { Ajv } from "ajv";
import { Cache } from "./cache";
import { Request } from "./requests/request";
import { Requests, RequestsParams } from "./requests/requests.factory";
import schema from "./schema.json";

type AssertionDefinition = {
  type: string;
  property: string;
  value?: unknown;
};

export type TestSpecificationParams = {
  name: string;
  path: string;
  description: string;
  requests: RequestsParams;
  assertions: AssertionDefinition[];
};

export class TestSpecification {
  readonly requests: Request[];

  constructor(
    private readonly data: TestSpecificationParams,
    private readonly cache: Cache
  ) {
    this.validate(data);

    this.requests = new Requests(this.data.requests, this.cache).init();
  }

  private validate(data: TestSpecificationParams): void {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      throw new Error(
        `Invalid test specification: ${JSON.stringify(validate.errors)}`
      );
    }
  }

  get name(): string {
    return this.data.name;
  }

  get path(): string {
    return this.data.path;
  }

  get description(): string | null {
    return this.data?.description;
  }

  get assertions(): AssertionDefinition[] {
    return this.data.assertions;
  }

  toJSON(): { name: string; description: string } {
    return {
      name: this.data.name,
      description: this.data.description,
    };
  }
}
