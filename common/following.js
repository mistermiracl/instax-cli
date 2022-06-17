import path from 'path';
import fs from 'fs';

import config from '../config';
import * as followingService from '../service/instagram/following';

function getFollowed() {
    try {
        const followed = JSON.parse(fs.readFileSync(config.followingFile));
        followed.date = new Date(followed.date);
        return ;
    } catch {
        return false;
    }
}

function renameFollowed(followed) {
    // TODO: take the current following file and rename it with the date it was created
    const date = new Date(followed.date);
    const newFilename = path.join(
        config.dataPath,
        `${config.followingFilenameExtless}_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${config.followingFilenameExt}`
    );
    fs.renameSync(config.followingFile, newFilename);
}

function saveFollowing(followingUsers) {
    const date = new Date();
    fs.writeFileSync(config.followingFile, JSON.stringify({
        date,
        users: followingUsers
    }));
}

// TODO: check should be more of an 'update' following
export async function updateFollowing() {
    // TODO: grab the returned following ids with the current following and get by pk directly then compare the usernames
    // if the key does not exist show that the user was removed from following, if the username exists but its different show the difference
    // if there is no change show that there is no change
    // if there is change save the new following
    const followingUsers = await followingService.getFollowingUsers();
    const followed = getFollowed();
    if(!followed) {
        saveFollowing(followingUsers);
        console.log('First use, nothing to compare with');
    } else {
        // TODO: call compare
        compareFollowing(followed, followingUsers);
        renameFollowed(followed);
        saveFollowing(followingUsers);
    }
}

// TODO: following history / analytics, in the past month how many new following, how many lost following, etc

// TODO: do not check anything just view current following stats, maybe make a decision based on that

/**
 * Compares the current following with previous following files from a list
 * @return {string[]|false} an array of messages of the changes | false if no change has happened
 */
export async function compareFollowing(followed, followingUsers) {
    // TODO: figure out how to call compareFollowing standalone with no params
    if(!followed) followed = getFollowed();
    if(!followingUsers) followingUsers = await followingService.getFollowingUsers();
    // TODO: make length comparison between the two arrays two establish whether users have been added or removed
    // TODO: if they are the same length but not all ids find a match then a user may have been removed while a new one may have been added keeping the same length with different users
    // find out how to pick that up
    // TODO: check if there is a previous file to compare with
    // TODO: show two options, to comapare with the inmediate previous file
    // or to choose from a list of all the files
    // only show the first 5. if the user presses enter show the next one, so on and so forth
    // once one is chosen compare the current following file with the selected previous following file
    // TODO: this method should return an array of 3 messages that will be destructured
    // the first message will contain any renames, the second any losses, the third any gains
    // if none of the above happen false will be returned
    // TODO: dont format messages return an array of 3 arrays
}