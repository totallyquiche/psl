require('dotenv').config()

const http = require('http');
const dbClient = require('sqlite3');
var querystring = require('querystring');

const shortUrlColumnName = process.env.SHORT_COLUMN_NAME
const longUrlColumnName = process.env.LONG_COLUMN_NAME
const tableName = process.env.TABLE_NAME
const sqliteFileName = process.env.SQLITE_FILE_NAME;
const serverPort = process.env.SERVER_PORT;
const baseUrl = process.env.BASE_URL;
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
        `INSERT INTO ${tableName}(\`${shortUrlColumnName}\`, \`${longUrlColumnName}\`) VALUES(?, ?)`,
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
    SELECT \`${shortUrlColumnName}\`, \`${longUrlColumnName}\` \
    FROM \`${tableName}\` \
    WHERE \`${shortUrlColumnName}\` = '${url.pathname.replace(/\//g, '')}'
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