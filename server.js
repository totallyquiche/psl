const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(302, {
    'Location': 'https://briandady.com',
  });

  res.end();
});

server.listen(process.env.PORT);