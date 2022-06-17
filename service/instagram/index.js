import config from '../../config';
import { getCredentials } from '../../common/credentials';

export function headers() {
    return {
        'Origin': config.instaUrl,
        'Referrer': config.instaUrl + '/',
        'X-IG-App-ID': config.igAppId,
        'Cookie': getCredentials()
    };
}