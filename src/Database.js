module.exports = class {
  #index = 0;
  #data = {};

  add(key, value) {
    this.#data[key] = value;
    this.#index++;
  }

  load(key) {
    return this.#data[key];
  }

  getIndex() {
    return this.#index;
  }
};
