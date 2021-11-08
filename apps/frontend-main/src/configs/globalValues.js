const { NODE_ENV, REACT_APP__BACKEND_MAIN_API___BASEURL } = process.env;

const globalValues = {
    credentials: {
        BACKEND_MAIN_API___BASEURL: REACT_APP__BACKEND_MAIN_API___BASEURL,
    },

    baseURLS: {
        BACKEND_MAIN_API___BASEURL: REACT_APP__BACKEND_MAIN_API___BASEURL,
    },

    environment: {
        CURRENT_ENVIRONMENT: NODE_ENV,
        IS_DEVELOPMENT: NODE_ENV === 'development',
    },
};

export default globalValues;

// *****************************************************************
// Simple function to notify if critical env values are not passed.
function checkAllCriticalEnvValuesAvailable() {
    const criticalEnvValueList = [REACT_APP__BACKEND_MAIN_API___BASEURL];

    const isAllCriticalEnvValuesAvailable = criticalEnvValueList.every(
        (envValue) => envValue,
    );

    if (!isAllCriticalEnvValuesAvailable) {
        console.error('NOTE : SOME CRITICAL ENV VALUES ARE MISSING');
    }
}
checkAllCriticalEnvValuesAvailable();
