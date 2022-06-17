import fs from 'fs';

import config from '../config';

function readCredentailsFile() {
    return fs.readFileSync(config.credentialsFile, 'utf8').split('\n');
}

export function getCredentials() {
    return readCredentailsFile()[0];
}

export function getIgUserId() {
    return readCredentailsFile()[1];
}

export function checkCredentials() {
    try {
        const credentials = readCredentailsFile();
        return credentials && credentials.length;
    } catch {
        return false;
    }
}

export function saveCredentials(credentials) {
    if(!fs.existsSync(config.dataPath)) {
        fs.mkdirSync(config.dataPath);
    }
    fs.writeFileSync(config.credentialsFile, credentials);
}