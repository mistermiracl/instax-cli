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
console.log('1. Update following');
console.log('2. Compare following');
// console.log('2. Sync highlights');
console.log('3. Update credentials');

const option = await input();

if(!checkCredentials()) {
    await promptCredentials();
}

switch(option) {
    case '1':
        const updateFollowingSteps = updateFollowing();
        const anyChanges = await updateFollowingSteps.next();
        if(anyChanges.value) {
            const shouldContinue = await input('Update local following? (y/n) ')
            if(shouldContinue.toLowerCase() === 'y') {
                await updateFollowingSteps.next();
                console.log('All done!');
            }
        }
        break;
    case '2':
        // TODO: show two options, to comapare with the inmediate previous file
        // or to choose from a list of all the files
        // only show the first 5. if the user presses enter show the next one, so on and so forth
        // once one is chosen compare the current following file with the selected previous following file
        console.log('1. Compare with last followed');
        console.log('2. Choose followed to compare to');
        const compareOption = await input();
        switch(compareOption) {
            case '1':
                break;
            case '2':
                break;
            default:
                console.log('Invalid option');
                break;
        }
        break;
    case '3':
        await promptCredentials();
        break;
    default:
        console.log('Invalid option');
        break;
}
await exit();