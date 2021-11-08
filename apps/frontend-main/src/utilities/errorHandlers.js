import { isObject } from 'lodash';

// Customized Error generator for error occurred while API requests.
// Mostly extracting API specific details (Like API Err Json Response, Custom Message) and adding it to Error object.
export function APIError(
    customErrMsg = 'Error Occurred. Please try again.',
    orgError = '',
    extraData = {},
) {
    const error = new Error(orgError || customErrMsg);

    // Adding more specific data to error object. So where error being handled can use them.
    error.customErrType = 'APIERROR';
    error.customErrMsg = customErrMsg;
    error.extraData = extraData;
    error.responseData = {};

    // If "API Response's JSON Data" can be extracted, Adding it to error object.
    if (orgError && isObject(orgError.response)) {
        error.responseData = orgError.response.data;
    } else if (orgError && isObject(orgError.responseData)) {
        error.responseData = orgError.responseData;
    } else if (extraData && isObject(extraData.response)) {
        error.responseData = extraData.response.data;
    }

    return error;
}
