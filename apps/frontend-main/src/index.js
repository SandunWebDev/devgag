import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import App from './pages/root/App/App';
import reportWebVitals from './reportWebVitals';
import './utilities/logger';
import routerHistory from './utilities/routerHistory';

import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <Router history={routerHistory}>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable={false}
                closeButton={false}
                pauseOnHover
            />

            <ChakraProvider>
                <App />
            </ChakraProvider>
        </Router>
    </React.StrictMode>,
    document.querySelector('#root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
