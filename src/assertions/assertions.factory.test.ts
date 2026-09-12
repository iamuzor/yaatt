import { describe, test, expect } from "bun:test";
import path from "path";
import fs from "fs";
import { Assertion } from "./assertion";

describe("Assertions", () => {
  const directory = path.join(process.cwd(), "./src/assertions");
  const assertions: Assertion[] = fs.readdirSync(directory)
    .map(file => require(path.join(directory, file)).default)
    .filter(file => String(file).includes('extends Assertion'))
    .map((cls) => new cls())
  const assertionNames = assertions.map(assertion => assertion.name)

  test.each(assertionNames)(`assertion name "%s" should be unique in: ${assertionNames}`, (name) => {
    const count = assertions.filter(assertion => assertion.name === name).length

    if (count > 1) {
      console.warn(`${name} is not unique in ${assertionNames}`)
    }

    expect(count).toEqual(1)
  })
});
