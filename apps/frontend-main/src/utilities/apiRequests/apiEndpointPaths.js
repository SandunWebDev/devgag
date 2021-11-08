const apiEndpointPaths = {
    // ******************************************* Backend Main API Server  *******************************************
    backendMainApiServer: {
        loginUser: { path: `/auth/login`, type: 'POST' },
        getLoggedUserDetails: { path: '/user/getme', type: 'POST' },
        getAllJokePosts: { path: `/jokepost/getall`, type: 'POST' },
    },
};

export default apiEndpointPaths;
