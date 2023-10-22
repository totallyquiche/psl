require('dotenv').config()

const http = require('http');
const dbClient = require('sqlite3');

const slugColumnName = process.env.SLUG_COLUMN_NAME
const urlColumnName = process.env.URL_COLUMN_NAME
const tableName = process.env.TABLE_NAME
const sqliteFileName = process.env.SQLITE_FILE_NAME;
const serverPort = process.env.SERVER_PORT;
const secretKey = process.env.SECRET_KEY

const handlePost = (req, res, db) => {
  req.on('data', chunk => {
    data = JSON.parse(chunk.toString('utf8'));

    if (data.secretKey !== secretKey) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end();
      return;
    }

    const insertStatement = `
      INSERT INTO \`${tableName}\`(\`${slugColumnName}\`, \`${urlColumnName}\`)
      VALUES(?,?)
    `;

    db.run(
      insertStatement,
      data.slug,
      data.url
    );

    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end();

    db.close();
  });
};

const handleGet = (req, res, db) => {
  const url = new URL(req.url || '', `https://${req.headers.host}`);

  const selectStatement = `
    SELECT \`${slugColumnName}\`, \`${urlColumnName}\` \
    FROM \`${tableName}\` \
    WHERE \`${slugColumnName}\` = '${url.pathname.replace(/\//g, '')}'
  `;

  db.all(selectStatement, (err, rows) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
    } else if (rows.length) {
      res.writeHead(302, {'Location': rows[0][urlColumnName]});
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
    }

    res.end();
  });

  db.close();
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' || req.method === 'GET') {
    const db = new dbClient.Database(sqliteFileName);

    (req.method === 'POST')
      ? handlePost(req, res, db)
      : handleGet(req, res, db);
  }
});

server.listen(serverPort);