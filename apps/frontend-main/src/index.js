import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import chakraCustomTheme from './configs/chakraThemeConfig';
import App from './pages/root/App/App';
import { GlobalContextProvider } from './reactContexts/globalContextor/globalContextor';
import reportWebVitals from './reportWebVitals';
import './utilities/logger';
import routerHistory from './utilities/routerHistory';

import './configs/fonts';
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

            {/* Initializing Chakra Light/Dark Mode */}
            <ColorModeScript
                initialColorMode={chakraCustomTheme.config.initialColorMode}
            />

            <ChakraProvider theme={chakraCustomTheme}>
                <GlobalContextProvider>
                    <App />
                </GlobalContextProvider>
            </ChakraProvider>
        </Router>
    </React.StrictMode>,
    document.querySelector('#root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
