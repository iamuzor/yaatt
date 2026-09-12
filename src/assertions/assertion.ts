import chalk from "chalk";

export abstract class Assertion {
    abstract readonly name: string
    abstract readonly description: string
    protected _message: string = ''
    protected _passed: boolean = false

    abstract evaluate(params: unknown): Assertion;

    protected format(result: boolean, message: string): string {
        return result ? message : chalk.red(message);
    }

    get message(): string {
        return this._message
    }

    get passed(): boolean {
        return this._passed
    }
}
