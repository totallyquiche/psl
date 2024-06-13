# Pumpkin Spice Linkté

A permashortlink engine (a.k.a. "URL shortener").

PSL really isn't ready for production. It's more of a proof-of-concept and
exercise in test-driven development.

For one thing, there is no real persistance layer. `Database` is just a thin
interface for an in-memory JavaScript object.

## Setup

1. `cp .env.example .env`
1. Set `BASE_URL` in `.env` file
1. `npm install`

## Usage

```js
const Database = require("src/Database");
const Engine = require("src/Engine");

const database = new Database();
const engine = new Engine(database);

engine.shorten("https://github.com"); // https://github.com/{UNIQUE_HASH}
```
