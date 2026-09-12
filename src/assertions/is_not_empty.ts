import chalk from "chalk";
import { Assertion } from "./assertion";

export default class IsNotEmpty extends Assertion {
  readonly name = "is_not_empty";
  readonly description = "asserts that the value of a property is not empty. this checks against array, string, number and boolean values.";

  evaluate(params: { actualValue: unknown, property: string }): IsNotEmpty {
    if (Array.isArray(params.actualValue)) {
      this._passed = params.actualValue.length > 0
    }
    else if (typeof params.actualValue === 'object' && !Array.isArray(params.actualValue) && params.actualValue !== null) {
      this._passed = Object.keys(params.actualValue).length > 0
    }
    else if (typeof params.actualValue === 'string') {
      this._passed = params.actualValue.length > 0
    }
    else if (typeof params.actualValue === 'number') {
      this._passed = true
    }
    else if (typeof params.actualValue === 'boolean') {
      this._passed = true
    }
    else {
      this._passed = false
    }

    this._message = `${chalk.italic(params.property)} ${chalk.underline(`is not empty`)}. ${this.getActualText(params.actualValue)}`;

    return this;
  }

  private getActualText(actualValue: unknown): string {
    if (Array.isArray(actualValue)) {
      return chalk.gray(`(size: ${actualValue.length})`)
    }
    else if (typeof actualValue === 'object' && !Array.isArray(actualValue) && actualValue !== null) {
      const keys = Object.keys(actualValue)
      const data: { [key: string]: unknown } = {}

      // we do this to limit the object printed out - as it may be too long and not fit well
      keys.forEach((val, i) => {
        if (i > 1) return

        data[keys[i]] = val
      })

      return chalk.gray(`(actual: ${JSON.stringify(data)})`)
    }
    else if (typeof actualValue === 'string') {
      const text = actualValue.length > 20 ? `${actualValue.slice(0, 20)}...` : actualValue
      return chalk.gray(`(actual: ${text})`)
    }
    else {
      return chalk.gray(`(actual: ${actualValue})`)
    }
  }
}
