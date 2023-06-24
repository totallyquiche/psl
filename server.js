require('dotenv').config()

const http = require('http');
const dbClient = require('sqlite3');

const shortUrlColumnName = process.env.SHORT_COLUMN_NAME
const longUrlColumNName = process.env.LONG_COLUMN_NAME
const tableName = process.env.TABLE_NAME
const sqliteFileName = process.env.SQLITE_FILE_NAME;
const serverPort = process.env.SERVER_PORT;
const baseUrl = process.env.BASE_URL;

const server = http.createServer((req, res) => {
  const db = new dbClient.Database(sqliteFileName);

  const selectStatement = `
    SELECT \`${shortUrlColumnName}\`, \`${longUrlColumNName}\` \
    FROM \`${tableName}\` \
    WHERE \`${shortUrlColumnName}\` = '${req.url}'
  `;

  db.all(selectStatement, (err, rows) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
    } else if (rows.length) {
      res.writeHead(302, {
        'Location': `${baseUrl}${rows[0].long}`,
      });
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
    }

    res.end();
  });

  db.close();
});

server.listen(serverPort);