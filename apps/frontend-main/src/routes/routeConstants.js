/* eslint-disable unicorn/prefer-object-from-entries */
/* eslint-disable unicorn/no-array-reduce */

const authRootBase = '/auth';
const userRootBase = '/user';
const feedRootBase = '/feed';

export const routePaths = {
    root: { path: '/' },

    // ****** Auth --> XXX ******
    auth__login: { path: `${authRootBase}/login` },
    auth__signup: { path: `${authRootBase}/signup` },

    // ****** User --> XXX ******
    user__account: { path: `${userRootBase}/account`, isPrivate: true },

    // ****** Feed --> XXX ******
    feed_jokes: { path: `${feedRootBase}/jokes` },
};

// Mapping above "routePath" into custom structure.
// Ex.

/**
 * Mapping above "routePath" into custom structure.
 * This is used in some specific cases.
 * Ex :
        {
            '/': { pathName:'root', path:'/'},
            'auth/login' : { pathName:'auth__login', path:'/auth/login' },
            ....
            ....
        }
 */
export const routePathIndexes = Object.entries(routePaths).reduce(
    (acc, item) => {
        const [key, value] = item;

        acc[value.path] = { pathName: key, ...value };

        return acc;
    },
    {},
);
