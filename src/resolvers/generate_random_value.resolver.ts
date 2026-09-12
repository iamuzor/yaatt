import { randomUUIDv7 } from "bun";
import { ValueResolver } from "./value_resolver";

export class GenerateRandomValueResolver implements ValueResolver {
    readonly name = 'GenerateRandomValueResolver';
    readonly description = 'Resolves placeholders by generating dynamic string or numeric values such as UUIDs, numbers, or dates.';

    resolve(data: string): string {
        const regex = /\{\{gen:[A-Za-z0-9_]+\}\}/g;

        return data.replace(regex, (substr: string, path): string => {
            const key = substr.split(":")[1].replaceAll('{{', '').replaceAll('}}', '');

            switch (key) {
                case 'uuid':
                    return randomUUIDv7();
                case 'number':
                    return Math.floor(Math.random() * (1000 - 0) + 0).toString()
                default:
                    throw new Error(`"${key} is not supported`);
            }
        });
    }
}
