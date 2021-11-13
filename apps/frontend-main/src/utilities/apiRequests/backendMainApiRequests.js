/* eslint-disable no-restricted-syntax */
/* eslint no-unused-vars: ["warn", { "args": "none" }] */

import { APIError } from '../errorHandlers';

import apiEndpointPaths from './apiEndpointPaths';
import axiosBackendMainApiInstance from './axiosInstances/axiosBackendMainApiInstance/axiosBackendMainApiInstance';

const backendMainApiServerEndpoints = apiEndpointPaths.backendMainApiServer;
export async function loginUser(reqBody = {}, options = {}) {
    try {
        const { username, password } = reqBody;

        const apiReqBody = {
            username,
            password,
        };

        const resObj = await axiosBackendMainApiInstance({
            url: `${backendMainApiServerEndpoints.loginUser.path}`,
            method: 'POST',
            data: apiReqBody,
            ...options,
        });

        const { data } = resObj.data;

        // Return AccessToken & RefreshToken
        return data;
    } catch (error) {
        const errMsg = error.message;
        const customErrMsg = error.customErrMsg || errMsg;

        log.error(error, { customErrMsg });
        return Promise.reject(APIError(customErrMsg, error));
    }
}

export async function signupUser(reqBody = {}, options = {}) {
    try {
        const { first_name, last_name, email, password } = reqBody;

        const apiReqBody = {
            first_name,
            last_name,
            email,
            password,
        };

        const resObj = await axiosBackendMainApiInstance({
            url: `${backendMainApiServerEndpoints.signupUser.path}`,
            method: 'POST',
            data: apiReqBody,
            ...options,
        });

        const { data } = resObj.data;

        // Return AccessToken & RefreshToken
        return data;
    } catch (error) {
        const errMsg = error.message;
        const customErrMsg = error.customErrMsg || errMsg;

        log.error(error, { customErrMsg });
        return Promise.reject(APIError(customErrMsg, error));
    }
}

export async function getLoggedUserDetails(reqBody = {}, options = {}) {
    try {
        const apiReqBody = {};

        const resObj = await axiosBackendMainApiInstance({
            url: `${backendMainApiServerEndpoints.getLoggedUserDetails.path}`,
            method: 'POST',
            data: apiReqBody,
            ...options,
        });

        const { data } = resObj.data;

        return data;
    } catch (error) {
        const errMsg = error.message;
        const customErrMsg = error.customErrMsg || errMsg;

        log.error(error, { customErrMsg });
        return Promise.reject(APIError(customErrMsg, error));
    }
}

export async function getAllJokePosts(reqBody = {}, options = {}) {
    try {
        const { page, per_page = 20, start_date } = reqBody;

        const apiReqBody = {
            page,
            per_page,
            start_date,
        };

        const resObj = await axiosBackendMainApiInstance({
            url: `${backendMainApiServerEndpoints.getAllJokePosts.path}`,
            method: 'POST',
            data: apiReqBody,
            ...options,
        });

        const { data, meta } = resObj.data;

        return {
            jokePostList: data,
            meta,
        };
    } catch (error) {
        const errMsg = error.message;
        const customErrMsg = error.customErrMsg || errMsg;

        log.error(error, { customErrMsg });
        return Promise.reject(APIError(customErrMsg, error));
    }
}

export async function likeOnePost(reqBody = {}, options = {}) {
    try {
        const {
            post_id,
            like = 1, // Like = 1  AND Unlike = -1
        } = reqBody;

        const apiReqBody = {
            post_id,
            like,
        };

        const resObj = await axiosBackendMainApiInstance({
            url: `${backendMainApiServerEndpoints.likeOnePost.path}`,
            method: 'POST',
            data: apiReqBody,
            ...options,
        });

        const { data } = resObj.data;

        return {
            updatedPostData: data,
        };
    } catch (error) {
        const errMsg = error.message;
        const customErrMsg = error.customErrMsg || errMsg;

        log.error(error, { customErrMsg });
        return Promise.reject(APIError(customErrMsg, error));
    }
}

export async function addJokePost(reqBody = {}, options = {}) {
    try {
        const {
            type,
            title,
            description,
            text_joke,
            text_background,
            meme_joke_file,
        } = reqBody;

        const apiReqBody = {
            type,
            title,
            description,
        };

        if (type === 'TEXT') {
            apiReqBody.text_joke = text_joke;
            apiReqBody.text_background = text_background;
        } else if (type === 'MEME') {
            // eslint-disable-next-line prefer-destructuring
            apiReqBody.meme_joke_image = meme_joke_file;
        }

        // To send data as "multipart/form-data"
        const formData = new FormData();
        const reqEntries = Object.entries(apiReqBody);
        for (const entry of reqEntries) {
            formData.append(entry[0], entry[1]);
        }

        const resObj = await axiosBackendMainApiInstance({
            url: `${backendMainApiServerEndpoints.addJokePost.path}`,
            method: 'POST',
            data: formData,
            ...options,
        });

        const { data } = resObj.data;

        return {
            updatedPostData: data,
        };
    } catch (error) {
        const errMsg = error.message;
        const customErrMsg = error.customErrMsg || errMsg;

        log.error(error, { customErrMsg });
        return Promise.reject(APIError(customErrMsg, error));
    }
}
