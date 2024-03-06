import childProcess from 'node:child_process';

/**
 * 
 * @param {string} cmd 
 * @param {string[]} args 
 * @param {import("node:child_process").SpawnOptions} options 
 * @returns 
 */
const spawnAsync = (cmd, args, options) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(cmd, args.join(' '));
    const child = childProcess.spawn(cmd, args, options);
    child.on('error', reject);
    child.on('exit', resolve);
  });

await spawnAsync('npm', ['install'], { stdio: 'inherit' });

const { onExit } = await import('signal-exit');
onExit((code, signal) => {
    console.log('RUN SCRIPT Closing...', { code, signal });
});

console.log('Starting...');

spawnAsync('npm', ['start', '--workspace=@anark-services/api'], { stdio: 'inherit' });
