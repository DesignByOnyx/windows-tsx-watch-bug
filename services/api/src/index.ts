import { createServer } from 'node:http';

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        data: 'Hello World 2!',
    }));
});

server.listen(8080, () => {
    console.log('Listening on PORT 8080');
});

const { onExit } = await import('signal-exit');
onExit((code, signal) => {
    console.log('API Closing...', { code, signal });
    server.close();
});
