import { get } from "lodash";
import { ValueResolver } from "./value_resolver";
import { Cache } from "../cache";

export class RequestResponseValueResolver implements ValueResolver {
    readonly name = 'RequestResponseValueResolver';
    readonly description = 'Resolves placeholders by extracting values from cached HTTP responses of previously executed requests using the request key and property path.';

    constructor(private readonly cache: Cache) { }

    resolve(data: string): string {
        const regex = /\{\{\s*([a-zA-Z_][\w]*(?:\[\d+\]|\.[a-zA-Z_][\w]*)*)\s*\}\}/g;

        return data.replace(regex, (_substr, path) => {
            const id = path.split(".")[0];
            const key = path.replace(`${id}.`, "");
            const value = get(this.cache.retrieve(id), key);

            if (!value) {
                throw new Error(
                    `Unable to replace {{${path}}} in ${data}. Are you sure the variable exists?`
                );
            }

            return value;
        });
    }
}
