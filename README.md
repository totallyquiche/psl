# Pumpkin Spice Linkté

A permashortlink engine (a.k.a. "URL shortener").

Proof-of-concept and exercise in test-driven development.

Definitely not prod-ready. For one thing, there is no real persistance layer.
`Database` is just a thin interface for an in-memory JavaScript object.

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

let longUrl = "https://github.com/";
let shortUrl = engine.shorten(longUrl); // https://github.com/{UNIQUE_HASH}
engine.lookup(shortUrl);                // https://github.com/
```
