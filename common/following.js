import path from 'path';
import fs from 'fs';

import config from '../config';
import { fileDate } from '../util';
// TODO: export a default object with all the methods
import followingService from '../service/instagram/following';

function getFollowed(followedFilename, full = false) {
    try {
        const followed = JSON.parse(fs.readFileSync(
            full ? followedFilename : path.join(config.dataPath, followedFilename)
        ));
        followed.date = new Date(followed.date);
        return followed;
    } catch {
        return false;
    }
}

function getLocalFollowing() {
    return getFollowed(config.followingFile, true);
}

function renameLocalFollowing(date) {
    const newFilename = path.join(
        config.dataPath,
        `${config.followingFilenameExtless}_${fileDate(date)}${config.followingFilenameExt}`
    );
    fs.renameSync(config.followingFile, newFilename);
}

function saveFollowing(users) {
    const date = new Date();
    fs.writeFileSync(config.followingFile, JSON.stringify({
        date,
        users
    }));
}

/**
 * Compares the current following with previous following files from a list
 * @return {string[]|false} an array of messages of the changes | false if no change has happened
 */
 function compareUsers(here, against) {
    // TODO: when losing users get the reason, either unfollowed, deactivated / blocked?
    // TODO: for lost users check if their username is still the same, if not show it
    // the above would require to make this async, add an extra parameter to decide whether to do this or not, to make the api calls or not
    const lostUsers = [];
    const gainedUsers = [];
    const usernameChanges = [];
    for(let id in here) {
        const hereUser = here[id];
        const againstUser = against[id];
        if(!againstUser) lostUsers.push(hereUser);
        else if(hereUser.username !== againstUser.username) {
            usernameChanges.push({
                from: hereUser,
                to: againstUser
            });
        }
    }
    for (let id in against) {
        const hereUser = here[id];
        const againstUser = against[id];
        if(!hereUser) gainedUsers.push(againstUser);
    }
    return [lostUsers, gainedUsers, usernameChanges];
}

function comparisonReport(lostUsers, gainedUsers, usernameChanges) {
    if(!lostUsers?.length && !gainedUsers?.length && !usernameChanges?.length) {
        console.log('No changes detected');
        return false;
    }
    if(lostUsers?.length) {
        let lostUsersMessage = [`\nLost ${lostUsers.length} users:\n`];
        for(let user of lostUsers) {
            lostUsersMessage.push(`id: ${user.id}, username: ${user.username}\n`);
        }
        console.log(lostUsersMessage.join(''));
    } else {
        console.log('No loses\n');
    }
    if(gainedUsers?.length) {
        let gainedUsersMessage = [`Gained ${gainedUsers.length} users:\n`];
        for(let user of gainedUsers) {
            gainedUsersMessage.push(`id: ${user.id}, username: ${user.username}\n`);
        }
        console.log(gainedUsersMessage.join(''));
    } else {
        console.log('No gains\n');
    }
    if(usernameChanges?.length) {
        let usernameChangesMessage = [`${usernameChanges.length} users changed their username:\n`];
        for(let change of usernameChanges) {
            usernameChangesMessage.push(`from (id: ${change.from.id}, username: ${change.from.username}) -> to (id: ${change.to.id}, username: ${change.to.username})\n`);
        }
        console.log(usernameChangesMessage.join(''));
    } else {
        console.log('No username changes\n');
    }
    return true;
}

// NOTE: i could just yield the filename and call next 5 times, so dumb
function* getFollowedFilenames() {
    // TODO: hardcoded extension
    const followedFilesRegex = /.{1,}_\d{1,}[.]json/; // followedFilesRegex.test.bind(followedFilesRegex); would have to do that to not use a lambda
    const files = fs.readdirSync(config.dataPath);// .filter(f => followedFilesRegex.test(f));
    // TODO: add time to following files to prevent same name in the first day
    files.sort(); // TODO: maybe sort its not needed cause of readdir natural ascending sorting, would have to loop backwards but its fine
    // this github https://github.com/nodejs/node/issues/3232 issue states that this behaviour is erratic so sort nonetheless
    const filesL = files.length;
    const first5 = [];
    var first5Sent = false;
    for(let i = filesL - 1; i >= 0; i--) {
        const filename = files[i];
        if (followedFilesRegex.test(filename)) {
            const ds = filename.split('_')[1].split('.')[0];
            const repr = [
                'followed from ',
                `${ds.substring(6, 8)}/${ds.substring(4, 6)}/${ds.substring(0, 4)} `,
                `${ds.substring(8, 10)}:${ds.substring(10, 12)}:${ds.substring(12, 14)}`
            ].join('');
            const file = {
                filename,
                repr
            };
            const iterationCount = filesL - i;
            if(iterationCount <= 5) {
                first5.push(file);
                if(iterationCount === 5) {
                    first5Sent = true;
                    yield first5;
                }
            } else yield file;
        }
    }
    if(!first5Sent) yield first5;
}

function getLastFollowedFilename() {
    return getFollowedFilenames().next().value[0].filename;
}

export function getFollowedOptions() {
    return getFollowedFilenames();
}

export function compareWithFollowed(followedFilename) {
    const followed = getFollowed(followedFilename);
    const localFollowing = getLocalFollowing();
    const [lostUsers, gainedUsers, usernameChanges] = compareUsers(followed.users, localFollowing.users);
    comparisonReport(lostUsers, gainedUsers, usernameChanges);
}

export function compareWithLastFollowed() {
    compareWithFollowed(getLastFollowedFilename());
}

export async function* updateFollowing() {
    const remoteFollowingUsers = await followingService.getFollowingUsers();
    const localFollowing = getLocalFollowing();
    if(!localFollowing) {
        saveFollowing(remoteFollowingUsers);
        console.log('First use, saved following, nothing to compare with');
    } else {
        const [lostUsers, gainedUsers, usernameChanges] = compareUsers(localFollowing.users, remoteFollowingUsers);
        yield comparisonReport(lostUsers, gainedUsers, usernameChanges);
        renameLocalFollowing(localFollowing.date);
        saveFollowing(remoteFollowingUsers);
    }
}

// TODO: following history / analytics, in the past month how many new following, how many lost following, etc

// TODO: do not check anything just view current following stats, maybe make a decision based on that

// TODO: compare between followed files, not necessarily the current one

// TODO: when comparing with old followings, treat the current following as the remote one