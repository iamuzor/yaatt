import chalk from "chalk";
import { Assertion } from "./assertion";

export default class StatusCode extends Assertion {
  readonly name = "status_code";
  readonly description = "asserts that the status code is equal to the provided status code";

  evaluate(params: { actualValue: { [key: string]: unknown }, assertedValue: unknown, property: string }): StatusCode {
    this._passed = params.actualValue?.__statusCode == params.assertedValue
    this._message = `${chalk.italic(params.property)} ${chalk.underline(`status code is "${params.assertedValue}"`)}. ${chalk.gray(`(actual: ${params.actualValue?.__statusCode})`)}`

    return this
  }
}
