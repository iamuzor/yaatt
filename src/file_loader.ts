import fs from "fs";
import yaml from 'js-yaml'
import path from "path";
import { TestSpecificationParams } from './test_specification'

export class FileLoader {
    static loadTests(): TestSpecificationParams[] {
        const directory = path.join(process.cwd(), "./tests");
        const specifiedPath = process.argv?.[2];
        const files = specifiedPath ? [specifiedPath] : fs.readdirSync(directory);
        const tests = []

        for (const i in files) {
            const content = yaml.load(fs.readFileSync(path.join(directory, files[i]), 'utf8'))

            tests.push({
                ...(content as unknown as TestSpecificationParams),
                path: files[i]
            })
        }

        return tests;
    }
}