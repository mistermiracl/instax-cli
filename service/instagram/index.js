import config from '../../config';
import { getCredentials } from '../../common/credentials';

export function headers() {
    return {
        'Origin': config.instaUrl,
        'Referrer': config.instaUrl + '/',
        'X-IG-App-ID': config.igAppId,//{ message: 'useragent mismatch', status: 'fail' } event if im not using any user agent even if its in the config
        'Cookie': getCredentials(),
        // TODO: User-Agent
        // X-ASBD-ID
        // X-csrftoken
        // X-IG-WWW-Claim
    };
}