import lodash from 'lodash';
import { toast } from 'react-toastify';

import { routePathIndexes } from '../../../../../routes/routeConstants';
import routerHistory from '../../../../routerHistory';
import { logoutUser } from '../../../../userAuthentication';

// Handling when API says "Provided UserToken is Invalid/Expired/NotProvided".
export function handleTokenInvalidations(response) {
    const {
        status = '',
        success = '',
        message = '',
    } = lodash.isObject(response.data) ? response.data : {};

    const currentLocationPath = routerHistory.location.pathname;
    const currentPathExtraData = routePathIndexes[currentLocationPath];
    const isPrivatePath = Boolean(currentPathExtraData.isPrivate);

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (success === false || status === 'fail' || status === 'error') {
        // eslint-disable-next-line unicorn/no-lonely-if
        if (
            message.includes('Token Expired') ||
            message.includes('Invalid Token') ||
            (message.includes('Token not provided') && isPrivatePath)
        ) {
            logoutUser({
                // If its a private path we logout user and redirect to login.
                // If not just logout the user, behind the scenes.
                preventRedirect: !isPrivatePath,
            });

            if (isPrivatePath) {
                toast.warning('Login Expired. Please Login Again.');
            }
        }
    }
}

export function extractBackendMainApiResErrorMsg(response) {
    // Check "BackendMainApi" sended "data.status" as "error" OR "fail" response in "Res Data" itself.
    // If so we, extract possible error messages and return it. So wherever function called initially can handle error graciously and easily.
    // Simply helper utility to extract cool error message from API sended data.
    //
    // If we don't do this, Since most of error "BackendMainApi" responses code are 400, 401, Etc.., final error message will be generic like "Request failed with status code 401"

    const {
        status = '',
        success = '',
        message = '',
        description = '',
        data = '',
    } = lodash.isObject(response.data) ? response.data : {};

    const apiErrMsg = message || description || data;

    if (success === false || status === 'fail' || status === 'error') {
        if (apiErrMsg) {
            return apiErrMsg;
        } else {
            return null;
        }
    } else {
        return null;
    }
}
