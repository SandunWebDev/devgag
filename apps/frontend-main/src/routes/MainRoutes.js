import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from '../pages/HomePage/HomePage';
import JokesPage from '../pages/JokesPage/JokesPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import UserAccountPage from '../pages/UserAccountPage/UserAccountPage';
import routerHistory from '../utilities/routerHistory';
import { removeUserIfExpired } from '../utilities/userAuthentication';

import PrivateRoute from './helpers/PrivateRoute/PrivateRoute';
import { routePaths } from './routeConstants';

// For each route change,
// 		- Check if User AccessToken expired (Through LocalStorage Value) and remove user from localStorage. No redirection happen here, Because public pages should be accessible even when user is not logged/valid/expired.
routerHistory.listen(() => {
    removeUserIfExpired();
});

// eslint-disable-next-line no-unused-vars
const TempPage = ({ pageName = 'Page', children }) => {
    return (
        <div>
            <h1>{pageName}</h1>
            <div>{children}</div>
        </div>
    );
};

export default class MainRoutes extends Component {
    constructor(props) {
        super(props);

        // Initial Check/Update.
        removeUserIfExpired();
    }

    render() {
        return (
            <Switch>
                {/* ****** Auth --> XXX ****** */}
                <Route path={routePaths.auth__login.path} exact>
                    <LoginPage />
                </Route>

                <Route path={routePaths.auth__signup.path} exact>
                    <SignupPage />
                </Route>

                {/* ****** User --> XXX ****** */}
                <PrivateRoute path={routePaths.user__account.path} exact>
                    <UserAccountPage />
                </PrivateRoute>

                {/* ****** Feed --> XXX ****** */}
                <Route path={routePaths.feed_jokes.path} exact>
                    <JokesPage />
                </Route>

                {/* Root */}
                <Route path={routePaths.root.path} exact>
                    <HomePage />
                </Route>

                {/* For any recognized path return to Home */}
                <Route path={routePaths.root.path}>
                    <Redirect to={routePaths.root.path} />
                </Route>
            </Switch>
        );
    }
}
