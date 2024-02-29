import { input, close } from './util/readline';
import { checkCredentials, saveCredentials } from './common/credentials';
import { compareWithFollowed, compareWithLastFollowed, getFollowedOptions, updateFollowing } from './common/following';
import { syncStories } from './common/users/stories';
import { syncHighlights } from './common/users/highlights';
import { getUserInfo } from './common/users/users';

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
console.log('1. Following');
console.log('2. Users');
console.log('3. Get user info');
console.log('4. Update credentials');

const option = await input();

if(!checkCredentials()) {
    await promptCredentials();
}

switch (option) {
    case '1':
        console.log('\n1. Update following');
        console.log('2. Compare following / followed');
        const followingOption = await input();
        // TODO: show current total number of following
        switch (followingOption) {
            case '1':
                const updateFollowingSteps = updateFollowing();
                const anyChanges = await updateFollowingSteps.next();
                if (anyChanges.value) {
                    const shouldContinue = await input('Update local following? (y/n) ');
                    if (shouldContinue.toLowerCase() === 'y') {
                        await updateFollowingSteps.next();
                        console.log('All done!');
                    }
                }
                break;
            case '2':
                console.log('\n1. Compare with last followed');
                console.log('2. Choose followed to compare to');
                const compareOption = await input();
                switch (compareOption) {
                    case '1':
                        compareWithLastFollowed();
                        break;
                    case '2':
                        const followedOptionsGen = getFollowedOptions();
                        const options = followedOptionsGen.next().value;
                        let i = 0
                        for (; i < options.length; i++) {
                            console.log(`${i + 1}. ${options[i].repr}`);
                        }
                        let selected;
                        while (isNaN(selected = await input())) {
                            const nextOption = followedOptionsGen.next().value;
                            if (nextOption) {
                                console.log(`${++i + 1}. ${nextOption.repr}`);
                                options.push(nextOption);
                            }
                        }
                        const selectedOption = options[selected - 1];
                        if (selectedOption) {
                            compareWithFollowed(selectedOption.filename);
                        } else {
                            console.log('Invalid option');
                        }
                        break;
                    default:
                        console.log('Invalid option');
                        break;
                }
                break;
            default:
                console.log('Invalid option');
                break;
        }
        break;
    case '2': {
        console.log('\n1. Stories');
        console.log('2. Posts (sync)');
        console.log('3. Reels (sync)');
        console.log('4. Tagged (sync)');
        const usersOption = await input();
        switch (usersOption) {
            case '1':
                console.log('\n1. Sync stories');
                console.log('2. Sync highlights');
                const storiesOption = await input();
                let username;
                switch (storiesOption) {
                    case '1':
                        username = await input('Enter the username / id: ');
                        if(!username) console.log('Invalid option');
                        if(await syncStories(username)) {
                            console.log('\nAll done!');
                        } else {
                            console.log('\nNo new stories to sync');
                        }
                        break;
                    case '2':
                        username = await input('Enter the username / id: ');
                        if(!username) console.log('Invalid option');
                        if(await syncHighlights(username)) {
                            console.log('\nAll done!');
                        } else {
                            console.log('\nNo new highlights to sync');
                        }
                        break;
                    default:
                        console.log('Invalid option');
                        break;
                }
                break;
            case '2':
                username = await input('\nEnter the username / id: ');
                break;
            case '3':
                username = await input('\nEnter the username / id: ');
                break;
            case '4':
                username = await input('\nEnter the username / id: ');
                break;
            default:
                console.log('Invalid option');
                break;
        }
        break;
    }
    case '3': {
        const entered = await input('\nEnter the id / username: ');
        const id = Number(entered);
        if(!isNaN(id)) {
            var userInfo = await getUserInfo(id);
        } else {
            var userInfo = await getUserInfo(null, entered);
        }
        if(userInfo) {
            console.log(userInfo);
        } else {
            console.log('Invalid identifier');
        }
        break;
    }
    case '4':
        await promptCredentials();
        break;
    default:
        console.log('Invalid option');
        break;
}

await exit();