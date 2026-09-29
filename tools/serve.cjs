const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2','.otf':'font/otf','.txt':'text/plain','.xml':'application/xml'};
const server = http.createServer((request,response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname); } catch { response.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  fs.readFile(file,(error,content) => { if(error){response.writeHead(404).end('Not found');return;}response.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'});response.end(content); });
});
server.listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
