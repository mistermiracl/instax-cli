import fs from 'fs';

import config from '../config';
import * as followingService from '../service/instagram/following';

function getFollowing() {
    try {
        return JSON.parse(fs.readFileSync(config.followingFile));
    } catch {
        return false;
    }
}

function saveFollowing(following) {
    // TODO: take the current following file and rename it with the date it was created
    fs.writeFileSync(config.followingFile, JSON.stringify(following))
}

// TODO: check should be more of an 'update' following
export async function checkFollowing() {
    // TODO: grab the returned following ids with the current following and get by pk directly then compare the usernames
    // if the key does not exist show that the user was removed from following, if the username exists but its different show the difference
    // if there is no change show that there is no change
    // if there is change save the new following
    const following = await followingService.getFollowing();
    const followed = getFollowing();
    if(!followed) {
        saveFollowing(following);
        console.log('Nothing to compare with');
        return;
    }
    // TODO: compare followed with following with replicable results for at least one day i think
}

// TODO: following history / analytics, in the past month how many new following, how many lost following, etc

/**
 * Compares the current following with previous following files from a list
 */
export function compareFollowing() {
    // TODO: check if there is a previous file to compare with
    // TODO: show two options, to comapare with the inmediate previous file
    // or to choose from a list of all the files
    // only show the first 5. if the user presses enter show the next one, so on and so forth
    // once one is chosen compare the current following file with the selected previous following file
}