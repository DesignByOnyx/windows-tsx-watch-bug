import childProcess, { SpawnOptions } from 'node:child_process';

/**
 * 
 * @param {string} cmd 
 * @param {string[]} args 
 * @param {import("node:child_process").SpawnOptions} options 
 * @returns 
 */
const spawnAsync = (cmd: string, args: string[], options: SpawnOptions) => {
  const child = childProcess.spawn(cmd, args, options);
  const promise = new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(cmd, args.join(' '));
    child.on('error', (err) => {
      console.log('SPAWN ERROR', err);
      reject(err);
    });
    child.on('exit', (...args) => {
      console.log('SPAWN EXIT', args);
      resolve(args[0]);
    });
  });

  console.log('typeof child.kill:', typeof child.kill)

  return Object.assign(promise, {
    on: child.on.bind(child),
    once: child.once.bind(child),
    off: child.off.bind(child),
    kill: child.kill.bind(child),
    stdio: child.stdio,
    stdout: child.stdout,
    stderr: child.stderr,
    stdin: child.stdin,
    child: child
  });
}

await spawnAsync('npm', ['install', '--no-fund', '--no-audit'], { stdio: 'inherit' });

console.log('Starting...');
// The following should NOT work on npm >=9.6.7 <10.3.0
const child = spawnAsync('npm', ['start', '--workspace=@anark-services/api'], { stdio: 'inherit' });

// NOTE: running `tsx` directly (without npm/npx) works as expected on npm >=9.6.7 <10.3.0
// const child = spawnAsync('tsx', ['watch', '--clear-screen=false', './services/api/src/index.ts'], { stdio: 'inherit' });
child.catch((err) => {
  console.log('[Run] The child process emitted an error', err);
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
];

/**
 * Listens for all known kill signals and returns a method to unsubscribe all listeners. 
 * @param {NodeJS.SignalsListener} callback
 */
const listenForKillSignal = (callback: NodeJS.SignalsListener) => {
  /** @param {NodeJS.Signals} sig */
  const handler = (sig: NodeJS.Signals) => {
      console.log('[Run] Kill signal received:', sig);
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

// setTimeout(() => {
//   console.log('About to terminate')
//   const success = child.kill('SIGTERM');
//   console.log('Success:', success);
// }, 3000);

listenForKillSignal((sig) => {
  console.log('[Run] SIGNAL RECEIVED', sig, '- Killing child PID:', child.child.pid);
  child.stderr?.destroy();
  child.stdin?.destroy();
  child.stdout?.destroy();
  // const success = child.kill(sig);
  if (child.child.pid) {
    console.log('killing');
    process.kill(child.child.pid, sig);
  }
})
