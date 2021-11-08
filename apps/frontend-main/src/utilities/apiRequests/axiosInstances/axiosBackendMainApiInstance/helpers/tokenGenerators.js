import {
    checkIsUserLoggedIn,
    getLoggedUserDetails,
} from '../../../../userAuthentication';

export const getAccessToken = () => {
    if (checkIsUserLoggedIn()) {
        return getLoggedUserDetails().AccessToken;
    } else {
        return null;
    }
};
