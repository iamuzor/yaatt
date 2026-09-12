import chalk from "chalk";
import { Assertion } from "./assertion";

export default class HasProperty extends Assertion {
  readonly name = "has_property";
  readonly description = "asserts that a property exists";

  evaluate(params: { actualValue: unknown; assertedValue: unknown; property: string }): HasProperty {
    if (typeof params.actualValue !== 'object' || params.actualValue === null || Array.isArray(params.actualValue)) {
      this._passed = false
      this._message = `${chalk.italic(params.property)} ${chalk.underline(`has property "${params.assertedValue}"`)}.`;
    } else {
      this._passed = Object.hasOwn(params.actualValue, String(params.assertedValue))
      this._message = `${chalk.italic(params.property)} ${chalk.underline(`has property "${params.assertedValue}"`)}. ${chalk.gray(`(actual: ${Object.keys(params.actualValue)})`)}`;
    }

    return this
  }
}
