import { Cache } from "../cache";
import { EnvironmentVariableResolver } from "./environment_variable.resolver";
import { GenerateRandomValueResolver } from "./generate_random_value.resolver";
import { RequestResponseValueResolver } from "./request_response.resolver";
import { ValueResolver } from "./value_resolver";

export class ValueResolvers {
    private readonly valueResolvers: ValueResolver[]
    private static instance: ValueResolvers

    private constructor(private readonly cache: Cache) {
        this.valueResolvers = [
            new RequestResponseValueResolver(this.cache),
            new GenerateRandomValueResolver(),
            new EnvironmentVariableResolver()
        ]
    }

    static init(cache: Cache): ValueResolvers {
        if (!this.instance) {
            ValueResolvers.instance = new ValueResolvers(cache)
        }

        return this.instance
    }

    resolve(data: any): unknown {
        if (typeof data == "number") {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map((item) => this.resolve(item));
        }

        if (typeof data == "object" && !Array.isArray(data)) {
            const obj: { [key: string]: unknown } = {};

            Object.keys(data).forEach((key) => {
                obj[key] = this.resolve(data[key]);
            });

            return obj;
        }

        if (typeof data == "string") {
            this.valueResolvers.forEach(resolver => {
                data = resolver.resolve(data)
            })

            return data
        }
    }
}