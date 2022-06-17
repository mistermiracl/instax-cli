import { input, close } from './util/readline';
import { checkCredentials, saveCredentials } from './common/credentials';
import { updateFollowing } from './common/following';

async function exit() {
    await close();
    process.exit(0);
}

async function promptCredentials() {
    console.log('Setup your credentials:');
    const credentials = await input();
    if(credentials) {
        console.log('Setup ur user id:');
        const igUserId = await input();
        if(igUserId) {
            saveCredentials(credentials + '\n' + igUserId);
        } else {
            console.log('Invalid user id');
        }
    } else {
        console.log('Invalid credentials');
    }
    await exit();
}

console.log(
    '---------------------------------------------\n' +
    '----------------Instax CLI-------------------\n' +
    '---------------------------------------------\n'
);
console.log('Welcome, which one will it be?');
console.log('1. Check following');
console.log('2. Download highlights');
console.log('3. Update credentials');

const one = await input();

if(!checkCredentials()) {
    await promptCredentials();
}

switch(one) {
    case '1':
        await updateFollowing();
        break;
    case '2':
        break;
    case '3':
        await promptCredentials();
        break;
    default:
        console.log('Invalid option');
        break;
}
await exit();