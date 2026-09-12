import chalk from "chalk";
import { Assertion } from "./assertion";

export default class Contains extends Assertion {
  readonly name = "contains";
  readonly description = "asserts that a property contains a specified value";

  evaluate(params: {
    actualValue: unknown;
    assertedValue: unknown;
    property: string
  }): Contains {
    if (!Array.isArray(params.actualValue)) {
      this._passed = false
      this._message = `${chalk.italic(params.property)} ${chalk.underline(`contains "${params.assertedValue}"`)}. ${chalk.gray(`(actual: ${params.actualValue})`)}`;

      return this;
    }

    this._passed = params.actualValue.some((actualValue) => actualValue == params.assertedValue);
    this._message = `${chalk.italic(params.property)} ${chalk.underline(`contains "${params.assertedValue}"`)}. ${chalk.gray(`(actual: ${params.actualValue})`)}`;

    return this;
  }
}
