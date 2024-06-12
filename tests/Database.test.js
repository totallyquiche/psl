const Database = require("../src/Database");

describe("Database", () => {
  test("adds key/value pair", () => {
    const database = new Database();
    database.add("a", "b");

    expect(database.load("a")).toBe("b");
  });
});
