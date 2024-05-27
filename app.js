const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    console.log(query)
    console.log(pathname)

    const filePath = path.join(__dirname, 'files', ''+query.filename)


    if (pathname === '/create' && query.filename && req.method === 'POST') {
        // Create a file
        fs.writeFile(filePath, query.content || '', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File created');
        });
    } else if (pathname === '/read' && query.filename && req.method === 'GET') {
        // Read a file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    } else if (pathname === '/delete' && query.filename && req.method === 'DELETE') {
        // Delete a file
        fs.unlink(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File deleted');
        });
    }else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
