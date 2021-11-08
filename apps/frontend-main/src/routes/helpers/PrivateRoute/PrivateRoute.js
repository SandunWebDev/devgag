import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { checkIsUserLoggedIn } from '../../../utilities/userAuthentication';
import { routePaths } from '../../routeConstants';

function defaultPrivateRuleFn(
    propValues, // eslint-disable-line no-unused-vars
) {
    return {
        isAuthorized: undefined,
        unauthorizedPageComponent: undefined,
        unauthorizedMsg: undefined,
        redirectTo: undefined,
    };
}

export default function PrivateRoute({
    children,
    customRuleFn = defaultPrivateRuleFn,
    ...rest
}) {
    const ruleDetails = customRuleFn(rest) || {};
    const {
        isAuthorized = true,
        unauthorizedPageComponent = null,
        unauthorizedMsg = 'You are not logged in.',
        redirectTo = routePaths.auth__login.path,
    } = ruleDetails;

    // Whether "customRuleFn" is provided or not, route is displayed only if user logged.
    const userLogged = checkIsUserLoggedIn();
    const isAllRulesTrue = userLogged && isAuthorized;

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAllRulesTrue ? (
                    React.cloneElement(children, rest)
                ) : (
                    <>
                        <div style={{ display: 'none' }}>
                            {toast.warning(unauthorizedMsg)}
                        </div>

                        {unauthorizedPageComponent || (
                            <Redirect
                                to={{
                                    pathname: redirectTo,
                                    state: { from: location },
                                }}
                            />
                        )}
                    </>
                )
            }
        />
    );
}
