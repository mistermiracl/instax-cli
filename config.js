import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataPath = path.join(__dirname, '.data');

const config = Object.freeze((function () {
    const followingFilenameExtless = 'following';
    const followingFilenameExt = '.json';
    const followingFilename = followingFilenameExtless + followingFilenameExt;
    const config = {
        dataPath,
        credentialsFile: path.join(dataPath, 'credentials.txt'),
        followingFilenameExtless,
        followingFilenameExt,
        followingFilename,
        followingFile: path.join(dataPath, followingFilename),
        instaUrl: 'https://www.instagram.com',
        instaIUrl: 'https://i.instagram.com',
        userAgent: '<userAgent>',
        igAppId: '<igAppId>',
    };
    return config;
})());

export default config;
