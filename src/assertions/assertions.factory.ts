import { Assertion } from "./assertion";
import Contains from "./contains";
import HasProperty from "./has_property";
import IsEquals from "./is_equals";
import IsGreaterThan from "./is_greater_than";
import IsLessThan from "./is_less_than";
import IsNotEmpty from "./is_not_empty";
import StatusCode from "./status_code";

export class Assertions {
  private readonly assertions: Assertion[];

  constructor() {
    this.assertions = [
      new IsEquals(),
      new IsNotEmpty(),
      new IsGreaterThan(),
      new IsLessThan(),
      new Contains(),
      new StatusCode(),
      new HasProperty()
    ];
  }

  get assertionNames(): string[] {
    return this.assertions.map((assertion) => assertion.name);
  }

  find(name: string): Assertion {
    const assertion = this.assertions.find(
      (assertion) => assertion.name === name
    );

    if (!assertion) {
      throw new Error(
        `Assertion "${name}" is not supported. Supported assertions are: ${this.assertionNames}`
      );
    }

    return assertion;
  }
}
