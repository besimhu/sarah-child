import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
};

createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const assetPath = relativePath === 'airphoto-preview.mp4' || relativePath === 'airphoto-preview.jpg'
    ? resolve(root, 'public', relativePath)
    : resolve(root, relativePath);
  const filename = assetPath;
  const fromRoot = filename.slice(root.length).replaceAll('\\', '/');
  if (!fromRoot || fromRoot.startsWith('../') || fromRoot === '..') {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!existsSync(filename) || !statSync(filename).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }
  const headers = { 'Content-Type': mimeTypes[extname(filename).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' };
  if (extname(filename).toLowerCase() === '.mp4') {
    headers['Accept-Ranges'] = 'bytes';
    const size = statSync(filename).size;
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return; }
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
      if (start > end || start >= size) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return; }
      res.writeHead(206, { ...headers, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}` });
      createReadStream(filename, { start, end }).pipe(res);
      return;
    }
    headers['Content-Length'] = size;
  }
  res.writeHead(200, headers);
  createReadStream(filename).pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Sarah Child site is running at http://127.0.0.1:${port}`);
});
