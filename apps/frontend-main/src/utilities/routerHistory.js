// NOTE : Carefully note that we must use "history 4.X.X" version to be compatible with "react-router-dom 5.X.X" version.
//        Otherwise it won't work at all OR will have hard to debug errors. (Ex. Redirected pages being empty.)

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export default history;
