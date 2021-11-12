import {
    Box,
    Image,
    Heading,
    VStack,
    Circle,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import DevGagLogoSvg from '../../../../assets/svg/devgag_logo.svg';
import { routePaths } from '../../../../routes/routeConstants';
import routerHistory from '../../../../utilities/routerHistory';

import SignupFormControls from './SignupFormControls';

export default function SignupForm(props) {
    const {
        onSuccessFn,
        onFailureFn,
        onFooterLinkClick = () => {
            routerHistory.push(routePaths.auth__login.path);
        },
    } = props;

    return (
        <Box className='SignupForm'>
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
                    Signup
                </Heading>
            </VStack>

            <VStack spacing={4} align='stretch' paddingTop='20px'>
                <SignupFormControls
                    onSuccessFn={onSuccessFn}
                    onFailureFn={onFailureFn}
                />
            </VStack>

            <Box marginTop='15px' fontSize='sm' cursor='pointer'>
                Already Has a Account ?&nbsp;
                <Text
                    color='blue.700'
                    display='inline'
                    onClick={() => onFooterLinkClick()}>
                    Login
                </Text>
            </Box>
        </Box>
    );
}
