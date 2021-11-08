/* eslint-disable no-param-reassign */

import axios from 'axios';

import globalValues from '../../../../configs/globalValues';
import { APIError } from '../../../errorHandlers';

import {
    handleTokenInvalidations,
    extractBackendMainApiResErrorMsg,
} from './helpers/backendMainApiErrorHandlers';
import { getAccessToken } from './helpers/tokenGenerators';

// Creating Instance
const axiosBackendMainApiInstance = axios.create({
    baseURL: globalValues.baseURLS.BACKEND_MAIN_API___BASEURL,
});

// Adding Request Interceptors (Doing things before request is sent)
axiosBackendMainApiInstance.interceptors.request.use(
    function (config) {
        // If user is logged and accessToken available, getting it.
        const accessToken = getAccessToken();

        if (accessToken) {
            // Adding suitable Authorization Headers, if applicable.
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            };
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

// Adding Response Interceptor (Doing things after response is received)
axiosBackendMainApiInstance.interceptors.response.use(
    function (response) {
        // Any status codes that falls inside the range of 2xx cause this function to trigger.

        // ----------------------
        // NOTE : Below we check some certain conditions, against json data sended by server. And generate custom errors if necessary.

        // Check "BackendMainApi" sended "data.status" as "error" OR "fail" response in "Res Data" itself.
        // If so we, extract possible error messages and return it as error. So wherever function called initially can handle error graciously and easily.
        const apiFailMsg = extractBackendMainApiResErrorMsg(response);
        if (apiFailMsg) {
            return Promise.reject(APIError(apiFailMsg, null, { response }));
        }

        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger. (Do something with response error)

        let customErrMsg = 'Error Occurred. Please Try Again';

        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx

            // Handling when API says "Provided UserToken is Invalid/Expired/NotProvided".
            handleTokenInvalidations(error.response);

            // Check "BackendMainApi" sended "data.status" as "error" OR "fail" response in "Res Data" itself.
            // If so we, extract possible error messages and return it as error. So wherever function called initially can handle error graciously and easily.
            const apiErrMsg = extractBackendMainApiResErrorMsg(error.response);
            if (apiErrMsg) {
                return Promise.reject(APIError(apiErrMsg, error));
            }
        } else if (error.request) {
            // The request was made but no response was received
            switch (true) {
                case error.message.includes('Network Error'):
                    customErrMsg = 'Network Error';
                    break;

                default:
                    break;
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            // Mostly in above "axiosBackendMainApiInstance.interceptors.request.use()" section.
            customErrMsg = 'Axios Error.';
        }

        return Promise.reject(APIError(customErrMsg, error));
    },
);

export default axiosBackendMainApiInstance;
