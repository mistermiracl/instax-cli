import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

import { userFolder } from ".";
import { extensionFromMIME, filenameFromUrl } from '../../util';
import { writeFile } from '../../util/files';
import userService from "../../service/instagram/users/user";
import highlightsService from "../../service/instagram/users/highlights";

const highlightsFolderName = 'highlights';

function highlightsFolderPath(userId) {
    const folderPath = path.join(userFolder(userId), highlightsFolderName);
    if(!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    return folderPath;
}

async function getHighlights(username) {
    const user = await userService.getUser(username);
    // TODO: if account is private and not following it, dont even try
    const tray = await highlightsService.getTray(user.id);
    if(tray?.length) {
        const highlights = await highlightsService.getHighlightReels(...tray.map(h => h.id));
        return [user.id, highlights];
    }
    return null;
}

export async function syncHighlights(username) {
    const [userId, highlights] = await getHighlights(username);
    if(highlights?.length) {
        let syncedAny = false;
        for(const h of highlights) {
            // TODO: get cover media
            const folderPath = path.join(highlightsFolderPath(userId), `${h.title}_${h.id.replace(/:/g, '_')}`);// replace : with _ since windows does not allow :
            if(!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
            for(const m of h.items) {
                const mediaUrl = m.video_versions ? m.video_versions[0].url : m.image_versions2.candidates[0].url;
                const mediaRes = await fetch(mediaUrl);
                const mediaFilename = `${filenameFromUrl(mediaUrl, false)}.${extensionFromMIME(mediaRes.headers.get('content-type'))}`;
                const mediaFilePath = path.join(folderPath, mediaFilename);
                if (!fs.existsSync(mediaFilePath)) {
                    // fs.writeFileSync(mediaFilePath, Buffer.from(await mediaRes.arrayBuffer()))
                    await writeFile(mediaFilePath, mediaRes.body);
                    syncedAny = true;
                }
            }
        }
        return syncedAny;
    }
    return false;
}