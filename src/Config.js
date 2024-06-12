module.exports = class {
  static getValue(configName) {
    return process.env[configName];
  }
};
