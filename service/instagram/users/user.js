import fetch from "node-fetch";

import config from "../../../config";
import { headers } from "..";

function userUrl(username) {
    return config.instaIUrl + `/api/v1/users/web_profile_info/?username=${username}`;
}

function userInfoUrl(userId) {
    return config.instaIUrl + `/api/v1/users/${userId}/info/`;
}

function getUser(username) {
    return fetch(
        userUrl(username),
        {
            headers: headers()
        }
    )
    .then(res => {
        if(res.headers.get('content-type').includes('json')) return res.json();
        return null;// user doesnt exist
    })
    .then(data => {
        // TODO: return if user has blocked viewer
        if(data?.status === 'ok' && data.data?.user) {// if user is null then user has blocked viewer
            return data.data.user;
        }
        return null;
    });
}

function getUserInfo(userId) {
    return fetch(
        userInfoUrl(userId),
        {
            headers: headers()
        }
    )
    .then(res => res.json())
    .then(data => data.user);
}

export default {
    getUser,
    getUserInfo
};

