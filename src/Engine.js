module.exports = class {
  convert(urlString) {
    const invalidUrlError = new Error("Invalid URL");

    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      throw invalidUrlError;
    }

    if (!urlString.match(/\..[^.]*$/)) {
      throw invalidUrlError;
    }

    const url = new URL(urlString);
  }
};
