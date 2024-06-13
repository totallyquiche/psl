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

    originalUrl = new URL(originalUrl);

    const shortenedUrl = this._getShortenedUrl(this.#Database.getIndex());

    this.#Database.add(shortenedUrl, originalUrl.toString());

    return shortenedUrl;
  }

  lookup(originalUrl) {
    originalUrl = new URL(originalUrl);

    return this.#Database.load(originalUrl.toString());
  }

  _getShortenedUrl(number) {
    const hash = new Sqids().encode([number]);

    return `${Config.getValue("BASE_URL")}/${hash}`;
  }
};
