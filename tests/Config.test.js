const Config = require("../src/Config");

describe("Config", () => {
  test("returns expected value", () => {
    expect(Config.getValue("BASE_URL")).toBe("https://github.com");
  });
});
