import { Box, Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { withRouter } from 'react-router-dom';

import DarkModeToggler from '../../components/widgets/DarkModeToggler/DarkModeToggler';
import { routePaths } from '../../routes/routeConstants';
import routerHistory from '../../utilities/routerHistory';

import LoginForm from './forms/LoginForm/LoginForm';

function LoginPage() {
    // Defining color depending on Light/Dark Mode
    const pageBgColor = useColorModeValue(
        'myBrand.pageBackground.light',
        'myBrand.pageBackground.dark',
    );
    const boxBgColor = useColorModeValue(
        'myBrand.containerBackground.light',
        'myBrand.containerBackground.dark',
    );

    return (
        <Center className='LoginPage' bg={pageBgColor} minHeight='100vh'>
            <Box position='absolute' top='10px' right='10px'>
                <DarkModeToggler />
            </Box>

            <Box
                width='500px'
                background={boxBgColor}
                shadow='md'
                margin='30px'
                padding='20px'>
                <LoginForm
                    onSuccessFn={() => {
                        // Redirecting Logged User.
                        const { location } = routerHistory;
                        const { state } = location;

                        const reactRouterState = state || {};
                        const { shouldRedirect, redirectPath } =
                            reactRouterState;

                        let redirectTo = routePaths.feed_jokes.path;

                        // If custom redirection path provided.
                        if (shouldRedirect && redirectPath) {
                            redirectTo = redirectPath;
                        }

                        routerHistory.push(redirectTo);
                    }}
                />
            </Box>
        </Center>
    );
}

export default withRouter(LoginPage);
