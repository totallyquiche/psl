const Config = require("../src/Config");

module.exports = class {
  convert(urlString) {
    const invalidUrlError = new Error("Invalid URL");

    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      throw invalidUrlError;
    }

    if (!urlString.match(/\..[^.]*$/)) {
      throw invalidUrlError;
    }

    new URL(urlString);

    return `${Config.getValue("BASE_URL")}/abc`;
  }
};
