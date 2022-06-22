import path from 'path';
import fs from 'fs';

import config from '../config';
import { fileDate } from '../util';
// TODO: export a default object with all the methods
import * as followingService from '../service/instagram/following';

function getLocalFollowing() {
    try {
        const localFollowing = JSON.parse(fs.readFileSync(config.followingFile));
        localFollowing.date = new Date(localFollowing.date);
        return localFollowing;
    } catch {
        return false;
    }
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

// NOTE: i could just yield the filename and call next 5 times, so dumb
export function* getFollowedOptions() {
    // TODO: hardcoded extension
    const followedFilesRegex = /.{1,}_\d{1,}[.]json/; // followedFilesRegex.test.bind(followedFilesRegex); would have to do that to not use a lambda
    const files = fs.readdirSync(config.dataPath);// .filter(f => followedFilesRegex.test(f));
    // TODO: add time to following files to prevent same name in the first day
    files.sort(); // TODO: maybe sort its not needed cause of readdir natural ascending sorting, would have to loop backwards but its fine
    // this github https://github.com/nodejs/node/issues/3232 issue states that this behaviour is erratic so sort nonetheless
    const first5 = [];
    var first5Sent = false;
    for(let i = filesL - 1; i >= 0; i--) {
        const file = files[i];
        if(followedFilesRegex.test(file)) {
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

export function getLastFollowed() {
    getFollowedOptions().next().value[0];
}

export async function* updateFollowing() {
    const remoteFollowingUsers = await followingService.getFollowingUsers();
    const localFollowing = getLocalFollowing();
    if(!localFollowing) {
        saveFollowing(remoteFollowingUsers);
        console.log('First use, saved following, nothing to compare with');
    } else {
        // const diff = compareUsers(localFollowing.users, remoteFollowingUsers);
        const [lostUsers, gainedUsers, usernameChanges] = compareUsers(localFollowing.users, remoteFollowingUsers);
        if(!lostUsers.length && !gainedUsers.length && !usernameChanges.length) {
            console.log('No remote changes detected');
            return false;
        }
        let lostUsersMessage = [`\nLost ${lostUsers.length} users:\n`];
        for(let user of lostUsers) {
            lostUsersMessage.push(`id: ${user.id}, username: ${user.username}\n`);
        }
        let gainedUsersMessage = [`Gained ${gainedUsers.length} users:\n`];
        for(let user of gainedUsers) {
            gainedUsersMessage.push(`id: ${user.id}, username: ${user.username}\n`);
        }
        let usernameChangesMessage = [`${usernameChanges.length} users changed their username:\n`];
        for(let change of usernameChanges) {
            usernameChangesMessage.push(`from (id: ${change.from.id}, username: ${change.from.username}) -> to (id: ${change.to.id}, username: ${change.to.username})\n`);
        }
        console.log(lostUsersMessage.join(''));
        console.log(gainedUsersMessage.join(''));
        console.log(usernameChangesMessage.join(''));
        yield true;
        renameLocalFollowing(localFollowing.date);
        saveFollowing(remoteFollowingUsers);
    }
}

// TODO: following history / analytics, in the past month how many new following, how many lost following, etc

// TODO: do not check anything just view current following stats, maybe make a decision based on that

// TODO: compare between followed files, not necessarily the current one

// TODO: when comparing with old followings, treat the current following as the remote one