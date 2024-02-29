import fetch from "node-fetch";
import queryString from 'node:querystring';

import { headers } from "..";
import config from "../../../config";

function trayUrl(userId) {
    return config.instaIUrl + `/api/v1/highlights/${userId}/highlights_tray/`;
}

function highlightReelsUrl(...reelIds) {
    // const query = new URLSearchParams();
    // reelIds.forEach(id => query.append('reel_ids', 'highlight:' + id));
    // reelIds.forEach(id => query.append('reel_ids', id));
    return config.instaIUrl + `/api/v1/feed/reels_media/?${queryString.encode({ reel_ids: reelIds })}`;
}

function getTray(userId) {
    return fetch(
        trayUrl(userId),
        {
            headers: headers()
        }
    )
    .then(res => res.json())
    .then(data => data.tray);
}

function getHighlightReels(...reelIds) {
    return fetch(
        highlightReelsUrl(...reelIds),
        {
            headers: headers()
        }
    )
    .then(res => res.json())
    .then(data => data.reels_media);
}

export default {
    getTray,
    getHighlightReels
};

