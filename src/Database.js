module.exports = class {
  #data = {};

  add(key, value) {
    this.#data[key] = value;
  }

  load(key) {
    return this.#data[key];
  }
};
