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

/** Mapping of known kill signals to a friendly description. */
const killSignals = [
    // Interrupt from keyboard (eg. CTRL + C)
    'SIGINT',
    // Termination signal, pretty similar to SIGINT
    'SIGTERM',
    // Hangup detected on controlling terminal or process
    'SIGHUP',
    // Sent by nodemon when a file changes
    'SIGUSR2',
] as const;
  
/** Known kill signals! */
type KillSignal = (typeof killSignals)[number];

/** Listens for all known kill signals and returns a method to unsubscribe all listeners. */
const listenForKillSignal = (callback: NodeJS.SignalsListener) => {
    const handler = (sig: KillSignal) => {
        console.log('Kill signal received:', sig);
        off();
        callback(sig);
    };

    const off = () => {
        killSignals.forEach((signal) => {
            process.off(signal, handler);
        });
    }

    killSignals.forEach((signal) => {
        // Some environments send the signal twice... so only capture the first
        process.once(signal, handler);
    });

    return off
};

// please please
listenForKillSignal((sig) => {
    console.log('[Server] SIGNAL RECEIVED', sig);
    server.close();
})
