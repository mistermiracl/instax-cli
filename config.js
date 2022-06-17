import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const dataFolder = '.data';
// const dataPath = path.join(__dirname, dataFolder);
// const configFile = 'config.json';

// var config = {};
// try {
//     config = fs.readFileSync(path.join(dataPath, configFile));
// } catch {
//     console.log('No config file, will create one when modified');   
// }

const dataPath = path.join(__dirname, '.data');

const config = Object.freeze((function () {
    const config = {
        dataPath,
        credentialsFile: path.join(dataPath, 'credentials.txt'),
        followingFile: path.join(dataPath, 'following.json'),
        instaUrl: 'https://www.instagram.com',
        instaIUrl: 'https://i.instagram.com',
        userAgent: '<userAgent>',
        igAppId: '<igAppId>',
    };
    return config;
})());

export default config;
