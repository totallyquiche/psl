# Pumpkin Spice Linkté

Pumpkin Spice Linkté (PSL) is a permashortlink engine (URL shortener) built on Node.

As basic as America's favorite fall garbage coffee drink!

## Getting Started

1. Copy `.env.example` to `.env`
1. Set `SERVER_PORT` in `.env` to the port you'd like PSL to run on
1. Create a SQLite database based on the following `.env` definitions:
    * File name: `SQLITE_FILE_NAME`
    * Table name: `TABLE_NAME`
    * Columns:
        * `SLUG_COLUMN_NAME`
            * Represents a permanent key for the URL
        * `URL_COLUMN_NAME`
            * Represents the full URL to redirect to
1. Populate the database with routes

    ```sql
    INSERT INTO urls('[SLUG]', '[URL]') VALUES('qq', 'https://theqq.website')
    ```

1. Rev up the engine with `node server.js`
1. Requests to the server containing `[SLUG]` are redirected to `[URL]`

    In our example, `https://[SERVER_HOST]:[SERVER_PORT]/qq` redirects to `https://theqq.website`

### Example SQLite Schema

`CREATE TABLE urls (slug TEXT UNIQUE, url TEXT);`
