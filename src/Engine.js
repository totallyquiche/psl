const Config = require("../src/Config");

const { default: Sqids } = require("sqids");

module.exports = class {
  #Database;

  constructor(database) {
    this.#Database = database;
  }

  shorten(originalUrl) {
    const invalidUrlError = new Error("Invalid URL");

    if (
      !originalUrl.startsWith("http://") &&
      !originalUrl.startsWith("https://")
    ) {
      throw invalidUrlError;
    }

    if (!originalUrl.match(/\..[^.]*$/)) {
      throw invalidUrlError;
    }

    new URL(originalUrl);

    const hash = this._getHash(this.#Database.getIndex());
    const shortenedUrl = `${Config.getValue("BASE_URL")}/${hash}`;

    this.#Database.add(shortenedUrl, originalUrl);

    return shortenedUrl;
  }

  _getHash(number) {
    return new Sqids().encode([number]);
  }

  lookup(url) {
    return this.#Database.load(url);
  }
};
