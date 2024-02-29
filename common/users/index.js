import path from 'path';
import fs from 'fs';

import config from '../../config';

const usernamesFileName = 'usernames.txt';

function usernamesFile(userId) {
    return path.join(userFolder(userId), usernamesFileName)
}

export function userFolder(userId) {
    const foldername = path.join(config.usersPath, userId);
    if(!fs.existsSync(foldername)) fs.mkdirSync(foldername, { recursive: true });
    return foldername;
}

export function syncUsername(userId, username) {
    // TODO: implement locking?
    const filename = usernamesFile(userId);
    const usernames = fs.readFileSync(filename, { encoding: 'utf8' }).split('\n');
    if(usernames.includes(username)) return;
    usernames.push(username);
    fs.writeFileSync(filename, usernames.join('\n'));
}