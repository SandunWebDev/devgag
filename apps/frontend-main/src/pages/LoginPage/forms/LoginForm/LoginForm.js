import {
    Box,
    Image,
    Heading,
    VStack,
    Circle,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import DevGagLogoSvg from '../../../../assets/svg/devgag_logo.svg';

import LoginFormControls from './LoginFormControls';

export default function LoginForm(props) {
    const { onSuccessFn, onFailureFn } = props;

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
        </Box>
    );
}
