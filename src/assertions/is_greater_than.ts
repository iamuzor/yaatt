import chalk from "chalk";
import { Assertion } from "./assertion";

export default class IsGreaterThan extends Assertion {
  readonly name = "is_greater_than";
  readonly description = "asserts that the value of a property is greater than the provided value";

  evaluate(params: {
    actualValue: unknown;
    assertedValue: unknown;
    property: string;
  }): IsGreaterThan {
    this._passed = Number(params.actualValue) > Number(params.assertedValue)
    this._message = `${chalk.italic(params.property)} ${chalk.underline(`${params.actualValue} is greater than ${params.assertedValue}`)}. ${chalk.gray(`(actual: ${params.actualValue})`)}`

    return this
  }
}
