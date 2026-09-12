import { expect, test, describe } from "bun:test";
import { TestSpecification } from "./test_specification";
import { Cache } from "./cache";

describe("TestSpecification", () => {
  test("should throw error if specification data is not valid", () => {
    expect(() => new TestSpecification({} as any, new Cache())).toThrowError(
      Error
    );
  });

  test("should create instance of TestSpecification successfully", () => {
    new TestSpecification(
      {
        name: "hello",
        description: "an example",
        path: "./",
        requests: {
          get_post: {
            url: "https://test.local",
            method: "get",
          },
        },
        assertions: [
          {
            type: "is_equals",
            property: "get_post.id",
            value: 1,
          },
        ],
      },
      new Cache()
    );
  });
});
