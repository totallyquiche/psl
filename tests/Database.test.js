const Database = require("../src/Database");

describe("Database", () => {
  let database;

  beforeEach(() => (database = new Database()));

  test("adds key/value pair", () => {
    database.add("a", "b");

    expect(database.load("a")).toBe("b");
  });

  test("returns current index", () => {
    expect(database.getIndex()).toBe(0);

    database.add("a", "b");

    expect(database.getIndex()).toBe(1);
  });
});
