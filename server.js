require('dotenv').config()

const http = require('http');
const dbClient = require('sqlite3');

const slugColumnName = process.env.SLUG_COLUMN_NAME
const urlColumnName = process.env.URL_COLUMN_NAME
const tableName = process.env.TABLE_NAME
const sqliteFileName = process.env.SQLITE_FILE_NAME;
const serverPort = process.env.SERVER_PORT;

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '', `https://${req.headers.host}`);
  const db = new dbClient.Database(sqliteFileName);

  const selectStatement = `
    SELECT \`${slugColumnName}\`, \`${urlColumnName}\` \
    FROM \`${tableName}\` \
    WHERE \`${slugColumnName}\` = '${url.pathname.replace(/\//g, '')}'
  `;

  db.all(selectStatement, (err, rows) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
    } else if (rows.length) {
      res.writeHead(302, {
        'Location': rows[0].long,
      });
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
    }

    res.end();
  });

  db.close();
});

server.listen(serverPort);