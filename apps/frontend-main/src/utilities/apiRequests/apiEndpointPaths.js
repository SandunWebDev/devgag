const apiEndpointPaths = {
    // ******************************************* Backend Main API Server  *******************************************
    backendMainApiServer: {
        // Auth
        loginUser: { path: `/auth/login`, type: 'POST' },
        signupUser: { path: `/auth/signup`, type: 'POST' },

        // Joke Feed
        getLoggedUserDetails: { path: '/user/getme', type: 'POST' },
        getAllJokePosts: { path: `/jokepost/getall`, type: 'POST' },
        likeOnePost: { path: `/jokepost/like`, type: 'POST' },
    },
};

export default apiEndpointPaths;
