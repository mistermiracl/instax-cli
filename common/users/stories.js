import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

import { userFolder } from '.';
import { daterepr, extensionFromMIME, filenameFromUrl } from '../../util';
import userService from '../../service/instagram/users/user';
import storiesService from '../../service/instagram/users/stories';

const storiesFolderName = 'stories';

function storiesFolder(userId) {
    const folderPath = path.join(userFolder(userId), storiesFolderName);
    if(!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    return folderPath;
}

async function getStories(username) {
    // TODO: save userid by username(s) in users.json
    const user = await userService.getUser(username);
    const stories = await storiesService.getStories(user.id);
    return [user.id, stories];
}

// TODO: return synced amount how many stories were synced
export async function syncStories(username) {
    const [userId, stories] = await getStories(username);
    const storiesFolderPath = storiesFolder(userId);
    if(stories && stories.length) {
        console.log(`\nFound ${stories.length} story(ies)`);
        let syncedAny = false;
        for(const s of stories) {
            // TODO: should i follow and get the post in the story, if any, like in the prev version?
            const takenAt = new Date(s.taken_at * 1000);
            const ds = daterepr(takenAt);
            const storyFolderPath = path.join(storiesFolderPath, ds);
            if(!fs.existsSync(storyFolderPath)) fs.mkdirSync(storyFolderPath);
            if(s.video_versions) {
                const storyVideoUrl = s.video_versions[0].url
                var res = await fetch(storyVideoUrl);
            } else {
                const storyPicUrl = s.image_versions2.candidates[0].url;
                var res = await fetch(storyPicUrl);
            }
            // const dts = datetimerepr(takenAt);
            // const storyFilename = `${dts}_${s.id}`;
            // NOTE: even if the file already exists a request has to be made in order to form the file name from the MIME header
            const storyFilename = filenameFromUrl(res.url, false) + '.' + extensionFromMIME(res.headers.get('content-type'));
            const storyFilePath = path.join(storyFolderPath, storyFilename);
            if(!fs.existsSync(storyFilePath)) {
                fs.writeFileSync(storyFilePath, Buffer.from(await res.arrayBuffer()));
                syncedAny = true;
            }
        }
        return syncedAny;
    }
    return false;
}