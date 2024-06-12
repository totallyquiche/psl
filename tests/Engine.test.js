require("dotenv").config({ path: ".env.test" });

const Database = require("../src/Database");
const Engine = require("../src/Engine");
const Config = require("../src/Config");

describe("Engine", () => {
  const engine = new Engine(new Database());
  const invalidUrlError = new Error("Invalid URL");

  test("should return a different URL than given", () => {
    const url = "https://github.com";

    expect(engine.shorten(url)).not.toBe(url);
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
      expect(() => engine.shorten(invalidUrl)).toThrow(invalidUrlError);
    });

    validUrls.forEach((validUrl) => {
      expect(() => engine.shorten(validUrl)).not.toThrow(invalidUrlError);
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
      expect(() => engine.shorten(invalidUrl)).toThrow(invalidUrlError);
    });

    validUrls.forEach((validUrl) => {
      expect(() => engine.shorten(validUrl)).not.toThrow(invalidUrlError);
    });
  });

  test("should return a url using the base URL", () => {
    const url = "https://not.github.com";
    const baseURL = Config.getValue("BASE_URL");

    expect(engine.shorten(url).startsWith(baseURL + "/")).toBe(true);
  });

  test("should return a url ending in a hash", () => {
    const url = "https://github.com";
    const baseURL = Config.getValue("BASE_URL");
    const pattern = /[a-zA-Z0-9]*$/;

    expect(engine.shorten(url).split(baseURL + "/")[1]).toMatch(pattern);
  });

  test("returns different URLs when given different URLs", () => {
    const firstUrl = engine.shorten("http://github.com");
    const secondUrl = engine.shorten("https://github.com");

    expect(firstUrl).not.toBe(secondUrl);
  });

  test("returns different URLs when given same URL", () => {
    const firstUrl = engine.shorten("https://github.com");
    const secondUrl = engine.shorten("https://github.com");

    expect(firstUrl).not.toBe(secondUrl);
  });

  test("returns original URL when given shortened URL", () => {
    const originalUrl = "https://github.com";
    const shortenedUrl = engine.shorten(originalUrl);

    expect(engine.lookup(shortenedUrl)).toBe(originalUrl);
  });
});
