import {
    Box,
    Image,
    Heading,
    VStack,
    Circle,
    useColorModeValue,
    Text,
} from '@chakra-ui/react';
import React from 'react';

import DevGagLogoSvg from '../../../../assets/svg/devgag_logo.svg';
import { routePaths } from '../../../../routes/routeConstants';
import routerHistory from '../../../../utilities/routerHistory';

import LoginFormControls from './LoginFormControls';

export default function LoginForm(props) {
    const {
        onSuccessFn,
        onFailureFn,
        onFooterLinkClick = () => {
            routerHistory.push(routePaths.auth__signup.path);
        },
    } = props;

    return (
        <Box className='LoginForm'>
            <VStack spacing={4}>
                <Circle
                    bg={useColorModeValue('gray.200', 'gray.300')}
                    padding='10px'>
                    <Image src={DevGagLogoSvg} boxSize='100px' />
                </Circle>

                <Heading
                    size='lg'
                    color={useColorModeValue(
                        'myBrand.blue.light',
                        'myBrand.blue.dark',
                    )}>
                    Login
                </Heading>
            </VStack>

            <VStack spacing={4} align='stretch' paddingTop='20px'>
                <LoginFormControls
                    onSuccessFn={onSuccessFn}
                    onFailureFn={onFailureFn}
                />
            </VStack>

            <Box marginTop='15px' fontSize='sm' cursor='pointer'>
                Don&apos;t have a Account?&nbsp;
                <Text
                    color={useColorModeValue('blue.700', 'blue.100')}
                    display='inline'
                    onClick={() => onFooterLinkClick()}>
                    Signup
                </Text>
            </Box>
        </Box>
    );
}
