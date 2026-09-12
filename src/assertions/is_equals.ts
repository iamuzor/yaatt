import chalk from "chalk";
import { Assertion } from "./assertion";

export default class IsEquals extends Assertion {
  readonly name = "is_equals";
  readonly description = "asserts that the value of a property is equal to the provided value";

  evaluate(params: {
    actualValue: unknown;
    assertedValue: unknown;
    property: string,
  }): IsEquals {
    this._passed = params.assertedValue == params.actualValue;
    this._message = `${chalk.italic(params.property)} ${chalk.underline(`is equals to "${params.assertedValue}"`)}. ${chalk.gray(`(actual: ${params.actualValue})`)}`;

    return this
  }
}
