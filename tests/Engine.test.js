const Engine = require("../src/Engine");

describe("Engine", () => {
  const engine = new Engine();

  test("should return a different URL than given", () => {
    const url = "https://github.com";

    expect(engine.convert(url)).not.toBe(url);
  });

  test("should only allow URLs starting with http:// or https://", () => {
    const expectedError = new Error("Invalid URL");
    const invalidUrls = [
      "github.com",
      "www.github.com",
      "ftp://github.com",
      "ftp://www.github.com",
    ];
    const validUrls = ["http://github.com", "https://github.com"];

    invalidUrls.forEach((invalidUrl) => {
      expect(() => engine.convert(invalidUrl)).toThrow(expectedError);
    });

    validUrls.forEach((validUrl) => {
      expect(() => engine.convert(validUrl)).not.toThrow(expectedError);
    });
  });
});
