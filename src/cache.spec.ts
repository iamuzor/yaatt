import { test, describe, expect } from "bun:test";
import { Cache } from "./cache";

describe("Cache", () => {
  test("should return saved items by key", () => {
    const cache = new Cache();

    cache.save("hello", { message: "hello world" });
    cache.save("bye", { message: "bye world" });
    cache.save("oops", { message: "oopsy daisy" });

    expect(cache.retrieve("hello")).toEqual({ message: "hello world" });
    expect(cache.retrieve("bye")).toEqual({ message: "bye world" });
    expect(cache.retrieve("oops")).toEqual({ message: "oopsy daisy" });
  });

  test("should return all the cached keys", () => {
    const cache = new Cache();

    cache.save("hello", { message: "hello world" });
    cache.save("bye", { message: "bye world" });
    cache.save("oops", { message: "oopsy daisy" });

    expect(cache.keys()).toEqual(["hello", "bye", "oops"]);
  });

  test("should return a JSON literal representation of cached items", () => {
    const cache = new Cache();

    cache.save("hello", { message: "hello world" });
    cache.save("bye", { message: "bye world" });
    cache.save("oops", { message: "oopsy daisy" });

    expect(cache.toJSON()).toEqual({
      hello: { message: "hello world" },
      bye: { message: "bye world" },
      oops: { message: "oopsy daisy" },
    });
  });
});
