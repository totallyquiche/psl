const Config = require("../src/Config");
const { default: Sqids } = require("sqids");

module.exports = class {
  #currentIndex = 0;
  #urls = {};

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

    const hash = new Sqids().encode([this.#currentIndex]);
    const shortenedUrl = `${Config.getValue("BASE_URL")}/${hash}`;

    this.#currentIndex++;
    this.#urls[shortenedUrl] = originalUrl;

    return shortenedUrl;
  }

  lookup(url) {
    return this.#urls[url];
  }
};
