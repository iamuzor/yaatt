import chalk from "chalk";
import { get } from "lodash"
import { TestSpecification, TestSpecificationParams } from "./test_specification";
import { Cache } from "./cache";
import { Assertions } from "./assertions/assertions.factory";

export class TestRunner {
  private readonly cache: Cache;
  private readonly assertions: Assertions;
  private readonly assertionResults: Map<string, unknown>;
  private static summarisedResults: boolean[];

  constructor() {
    if (!TestRunner.summarisedResults) {
      TestRunner.summarisedResults = [];
    }

    this.cache = new Cache();
    this.assertions = new Assertions();
    this.assertionResults = new Map();
  }

  private runAssertions(specification: TestSpecification) {
    console.log(`\n${chalk.bold.underline('ASSERTIONS')}\n`)

    for (const assertion of specification.assertions) {
      const asserted = this.assertions
        .find(assertion.type)
        .evaluate({
          actualValue: get(this.cache.toJSON(), assertion.property),
          assertedValue: assertion.value,
          property: assertion.property
        });

      this.assertionResults.set(assertion.property, asserted.passed);
      TestRunner.summarisedResults.push(asserted.passed);

      if (asserted.passed) {
        console.log(`✅ Pass\t\t${asserted.message}`)
      } else {
        console.error(`❌ Fail\t\t${asserted.message}`)
      }
    }
  }

  private async runRequests(spec: TestSpecification) {
    console.log(`\n${chalk.bold.underline('REQUESTS\n')}`)

    for (const request of spec.requests) {
      await request.execute();

      console.log(`${request.emoji} ${request.id}\t\t${request.statusCode}\t${request.duration}`)
    }
  }

  public passed(): boolean {
    return TestRunner.summarisedResults.every((r) => !!r);
  }

  public passCount(): number {
    return TestRunner.summarisedResults.filter(r => r === true).length
  }

  public failCount(): number {
    return TestRunner.summarisedResults.filter(r => r === false).length
  }

  async execute(data: TestSpecificationParams) {
    const specification = new TestSpecification(data, this.cache);

    console.log('--------------------------------------------------------------------------------------------')
    console.log(`\n${chalk.bold.underline('TEST SUITE\n')}`)
    console.log(`${specification.name} ${chalk.gray(`(${specification.path})`)}`)

    await this.runRequests(specification);
    this.runAssertions(specification);
    console.log('--------------------------------------------------------------------------------------------')

    console.log('\n')
  }
}
