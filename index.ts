import chalk from "chalk";
import { TestRunner } from "./src/test_runner";
import { FileLoader } from "./src/file_loader";
import { exit } from "process";

async function run() {
  const startTime = performance.now();
  const tests = FileLoader.loadTests()
  const runner = new TestRunner();

  for (const i in tests) {
    await runner.execute(tests[i])
  }

  const duration = ((performance.now() - startTime) / 1000).toFixed(2) // in seconds

  console.log('*********************************************************')
  console.log(`\x20\x20${chalk.bold('RESULT:')}\x20${runner.passed() ? chalk.bgGreen.bold('\x20PASSED\x20') : chalk.bgRed.bold('\x20FAILED\x20')} (${runner.passCount()} passed, ${runner.failCount()} failed, ${duration} seconds)`)
  console.log('*********************************************************')

  if (process.execArgv.includes('--watch')) {
    return
  }

  exit(runner.passed() ? 0 : 1)
}

run();
