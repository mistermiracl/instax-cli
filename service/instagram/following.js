import fetch from "node-fetch";

import config from "../../config";
import { headers } from ".";
import { getIgUserId } from "../../common/credentials";

function followingUrl(count = 192) {
    return config.instaIUrl + `/api/v1/friendships/${getIgUserId()}/following/?count=${count}`;
}

export function getFollowing() {
    // TODO: return an object instead of an array, with the pks as keys but with the same object as value nonetheless
    return fetch(followingUrl(), {
        headers: headers()
    })
    .then(res => res.json())
    .then(data => data.users && data.users.map(u => ({ id: u.pk, username: u.username })));
}
