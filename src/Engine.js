module.exports = class {
  convert(urlString) {
    const invalidUrlError = new Error("Invalid URL");

    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      throw invalidUrlError;
    }

    const url = new URL(urlString);
  }
};
