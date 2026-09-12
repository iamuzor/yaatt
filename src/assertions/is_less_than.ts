import chalk from "chalk";
import { Assertion } from "./assertion";

export default class IsLessThan extends Assertion {
  readonly name = "is_less_than";
  readonly description = "asserts that the value of a property is less than to the provided value";

  evaluate(params: { actualValue: unknown; assertedValue: unknown; property: string; }): IsLessThan {
    this._passed = Number(params.actualValue) < Number(params.assertedValue)
    this._message = `${chalk.italic(params.property)} ${chalk.underline(`${params.actualValue} is less than ${params.assertedValue}`)}. ${chalk.gray(`(actual: ${params.actualValue})`)}`

    return this
  }
}
