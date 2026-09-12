import { ValueResolver } from "./value_resolver";

export class EnvironmentVariableResolver implements ValueResolver {
    readonly name = 'EnvironmentVariableResolver';
    readonly description = 'Resolves placeholders by reading values from environment variables at runtime';

    resolve(data: string): string {
        const regex = /\{\{env:[A-Za-z0-9_]+\}\}/g;

        return data.replace(regex, (substr: string): string => {
            const key = substr.split(":")[1].replaceAll('{{', '').replaceAll('}}', '');

            if (!(key in process.env)) {
                throw new Error(`"${key}" not defined in environment.`);
            }

            return process.env?.[key] ?? '';
        });
    }
}
