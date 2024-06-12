const Engine = require("../src/Engine");

describe("Engine", () => {
  test("should return a different URL than given", () => {
    const engine = new Engine();
    const url = "https://github.com";

    expect(engine.convert(url)).not.toBe(url);
  });
});
