import fetch from "node-fetch";

import config from "../../../config";
import { headers } from "..";

function storiesUrl(userId) {
    return config.instaIUrl + `/api/v1/feed/user/${userId}/story/`;
}

function getStories(userId) {
    return fetch(
        storiesUrl(userId),
        {
            headers: headers()
        }
    )
    .then(res => res.json())
    .then(data => data.reel?.items);
}

export default {
    getStories
};

