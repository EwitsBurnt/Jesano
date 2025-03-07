const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from test server!</h1><p>If you can see this, your localhost is working.</p>');
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
}); 