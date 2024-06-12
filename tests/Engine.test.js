require("dotenv").config({ path: ".env.test" });

const Engine = require("../src/Engine");
const Config = require("../src/Config");

describe("Engine", () => {
  const engine = new Engine();
  const invalidUrlError = new Error("Invalid URL");

  test("should return a different URL than given", () => {
    const url = "https://github.com";

    expect(engine.convert(url)).not.toBe(url);
  });

  test("should only allow URLs starting with http:// or https://", () => {
    const invalidUrls = [
      "github.com",
      "www.github.com",
      "ftp://github.com",
      "ftp://www.github.com",
    ];
    const validUrls = ["http://github.com", "https://github.com"];

    invalidUrls.forEach((invalidUrl) => {
      expect(() => engine.convert(invalidUrl)).toThrow(invalidUrlError);
    });

    validUrls.forEach((validUrl) => {
      expect(() => engine.convert(validUrl)).not.toThrow(invalidUrlError);
    });
  });

  test("should only allow URLs ending in (dot)domain", () => {
    const invalidUrls = ["http://github", "https://github"];
    const validUrls = [
      "http://github.com",
      "http://github.com.dev",
      "https://github.com",
      "https://github.com.dev",
    ];

    invalidUrls.forEach((invalidUrl) => {
      expect(() => engine.convert(invalidUrl)).toThrow(invalidUrlError);
    });

    validUrls.forEach((validUrl) => {
      expect(() => engine.convert(validUrl)).not.toThrow(invalidUrlError);
    });
  });

  test("should return a url using the base URL", () => {
    const url = "https://not.github.com";
    const baseURL = Config.getValue("BASE_URL");

    expect(engine.convert(url).startsWith(baseURL + "/")).toBe(true);
  });

  test("should return a url ending in a hash", () => {
    const url = "https://github.com";
    const baseURL = Config.getValue("BASE_URL");
    const pattern = /[a-zA-Z0-9]*$/;

    expect(engine.convert(url).split(baseURL + "/")[1]).toMatch(pattern);
  });

  test("returns different URLs when given different URLs", () => {
    const firstUrl = engine.convert("http://github.com");
    const secondUrl = engine.convert("https://github.com");

    expect(firstUrl).not.toBe(secondUrl);
  });
});
