require('dotenv').config()

const http = require('http');
const dbClient = require('sqlite3');
var querystring = require('querystring');

const slugColumnName = process.env.SLUG_COLUMN_NAME
const urlColumnName = process.env.URL_COLUMN_NAME
const tableName = process.env.TABLE_NAME
const sqliteFileName = process.env.SQLITE_FILE_NAME;
const serverPort = process.env.SERVER_PORT;
const apiKey = process.env.API_KEY;

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '', `https://${req.headers.host}`);

  if (
    req.method === 'POST' &&
    url.pathname.replace(/\//g, '') === 'add' &&
    url.searchParams.get('api_key') === apiKey
  ) {
    let body = '';

    req.on('data', data => {
      body += data;
    });

    req.on('end', () => {
      const db = new dbClient.Database(sqliteFileName);
      const params = querystring.parse(body);

      db.run(
        `INSERT INTO ${tableName}(\`${slugColumnName}\`, \`${urlColumnName}\`) VALUES(?, ?)`,
        [
          Buffer.from(params.ID).toString('base64'),
          params.post_url,
        ],
        err => {
          if (err) {
            console.log(err);
          }
        }
      );

      db.close();
    });

    res.end();

    return;
  }

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