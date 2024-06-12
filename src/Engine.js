const Config = require("../src/Config");
const { default: Sqids } = require("sqids");

module.exports = class {
  #currentIndex = 0;

  convert(urlString) {
    const invalidUrlError = new Error("Invalid URL");

    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      throw invalidUrlError;
    }

    if (!urlString.match(/\..[^.]*$/)) {
      throw invalidUrlError;
    }

    new URL(urlString);

    const hash = new Sqids().encode([this.#currentIndex]);

    this.#currentIndex++;

    return `${Config.getValue("BASE_URL")}/${hash}`;
  }
};
