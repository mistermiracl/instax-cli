import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

export function input(message = '') {
    return new Promise(resolve => {
        rl.question(message, ans => {
            resolve(ans);
        });
    });
}

export function close() {
    const p = new Promise(resolve => {
        rl.once('close', () => {
            resolve();
        });
    });
    rl.close();
    return p;
}