import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import chakraCustomTheme from '../../../configs/chakraThemeConfig';
import { GlobalContextProvider } from '../../../reactContexts/globalContextor/globalContextor';
import '../../../utilities/logger';
import routerHistory from '../../../utilities/routerHistory';

import '../../../configs/fonts';
import '../../../index.css';

export default function AppWrapper(props) {
    const { children } = props;

    return (
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
                <GlobalContextProvider>{children}</GlobalContextProvider>
            </ChakraProvider>
        </Router>
    );
}
