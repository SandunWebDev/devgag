/* eslint-disable jsx-a11y/no-static-element-interactions */

import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import browserStorage from 'store2';

import { routePaths } from '../routes/routeConstants';

import routerHistory from './routerHistory';

/**
 * There are multiple place in whole app that UserAuthentication/Redirection/LogOut related logic happens. In some cases they are interrelated and complicated.
 * Anyway for somewhat better understanding here is some list of place where important logics happen. (Not a comprehensive List)
 *  	1. MainRoutes Component - Handle AccessToken Expiration Check on Each Route Change.
 * 		2. LoginPage Component - Handle Normal Login. (Also most of logoutUser() fn cases get redirected to here)
 * 		3. PrivateRoute Component - Handle "IsUserLogged / LogOut" logics and any other custom passed logic to decide requested private route path should render or not.
 * 		4. TokenGenerators Functions - Get/Generate 'AccessToken' value for specific Server. (So Authentication needed API Endpoint can be accessed.)
 * 		5. AxiosInstances Functions - Passing AccessToken if applicable. Also handle logOut() cases, when called API Endpoint itself return provided token is Expired/Invalid/NotProvided.
 *		6. ...
 *
 * 		1. HomePage - Redirect to Dashboard if already logged.
 * 		2. ...
 */

const userAuthConfig = {
    userDataLocalStorageKey: 'user', // In which key "Logged User" data (Like AccessToken, Decoded Token Data, username, etc...) are stored.
};

export function getLoggedUserDetails() {
    return browserStorage.get(userAuthConfig.userDataLocalStorageKey) || {};
}

export function getLoggedUserId() {
    const loggedUserDetails = getLoggedUserDetails();
    return loggedUserDetails.userId;
}

export function checkIsUserLoggedIn() {
    const existingUserValueInStorage = getLoggedUserDetails();

    if (existingUserValueInStorage.AccessToken) {
        return true;
    }
    return false;
}

export function logoutUser(options = {}) {
    const {
        redirectTo = routePaths.auth__login.path, // By default re-direct to here.
        history = routerHistory,
        preventRedirect = false,
    } = options;

    browserStorage.set(userAuthConfig.userDataLocalStorageKey, {});

    if (!preventRedirect && history && history.push) {
        history.push(redirectTo);
    }

    return !preventRedirect ? <Redirect to={redirectTo} /> : null;
}

export function LogoutUserButtonWrapper(props) {
    const { children, redirectTo = routePaths.auth__login.path } = props;

    const [loggedOut, setLoggedOut] = useState(false);

    const logout = () => {
        setLoggedOut(true);
        logoutUser();
    };

    if (loggedOut) {
        return <Redirect to={redirectTo} push />;
    }

    return (
        <div
            onClick={logout}
            style={{
                width: '100%',
            }}>
            {children}
        </div>
    );
}

// This is what happen when User Successfully Logged.
export function saveLoggedUser(passedUserDetails = {}) {
    try {
        const { AccessToken, RefreshToken } = passedUserDetails;

        if (!AccessToken || !RefreshToken) {
            return;
        }
        const existingUserValuesInStorage = getLoggedUserDetails();

        // Getting encoded values inside AccessToken.
        const decodedTokenInfo = jwt.decode(AccessToken);

        browserStorage.set(userAuthConfig.userDataLocalStorageKey, {
            ...existingUserValuesInStorage,
            ...passedUserDetails, // In most cases, this receive key values such as AccessToken, RefreshToken.
            decodedTokenData: decodedTokenInfo, // Normally available data keys are exp, iat, iss, user_id, username, etc...

            // For Convenience.
            userId: decodedTokenInfo.user_id,
            username: decodedTokenInfo.username,
        });
    } catch {
        logoutUser();
    }
}

// NOTE : This only handle expiration by checking token exp value in local storage.

export function checkIsUserExpired(
    options = {}, // eslint-disable-line no-unused-vars
) {
    if (!checkIsUserLoggedIn()) {
        return null;
    }

    const existingUserValueInStorage = getLoggedUserDetails();
    const { exp: tokenExpireTimeAsSeconds } =
        existingUserValueInStorage.decodedTokenData;

    const expTime = DateTime.fromSeconds(tokenExpireTimeAsSeconds);
    const currentTime = DateTime.local();

    return expTime < currentTime;
}

export function removeUserIfExpired() {
    if (checkIsUserLoggedIn() && checkIsUserExpired()) {
        logoutUser({
            preventRedirect: true, // No redirection happen here, Because public pages should be accessible even when user is not logged/valid/expired.
        });
    }
}
