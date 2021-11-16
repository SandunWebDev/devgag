import {
    Box,
    Button,
    VStack,
    Flex,
    Image,
    Heading,
    Icon,
    Circle,
    Text,
} from '@chakra-ui/react';
import React, { Component } from 'react';
import {
    BiLogIn as BiLogInIcon,
    BiUserCircle as BiUserCircleIcon,
    BiUserPin as BiUserPinIcon,
} from 'react-icons/bi';
import { Link } from 'react-router-dom';

import BackImage__HappyPeopleSvg from '../../assets/svg/backImage__happyPeople.svg';
import DevGagLogoWithoutTextSvg from '../../assets/svg/devgag_logo_without_text.svg';
import withUserColorModeValue from '../../components/hoc/withUserColorModeValue/withUserColorModeValue';
import DarkModeToggler from '../../components/widgets/DarkModeToggler/DarkModeToggler';
import { routePaths } from '../../routes/routeConstants';
import routerHistory from '../../utilities/routerHistory';
import { checkIsUserLoggedIn } from '../../utilities/userAuthentication';

class HomePage extends Component {
    componentDidMount() {
        if (checkIsUserLoggedIn()) {
            routerHistory.push(routePaths.feed_jokes.path);
        }
    }

    render() {
        const { colorMode } = this.props;

        return (
            <Flex
                className='HomePage'
                align='center'
                justify='center'
                minHeight='100vh'
                padding='20px'
                bg={
                    colorMode === 'light'
                        ? 'myBrand.pageBackground.light'
                        : 'myBrand.pageBackground.dark'
                }>
                <Box position='absolute' top='10px' right='10px'>
                    <DarkModeToggler />
                </Box>

                <Box width='100%'>
                    <VStack width='100%' spacing={5}>
                        <Box zIndex='100'>
                            <Circle bg='gray.100' padding='15px'>
                                <Image
                                    src={DevGagLogoWithoutTextSvg}
                                    alt='DevGag Logo'
                                    boxSize='100%'
                                    maxW='125px'
                                />
                            </Circle>
                        </Box>

                        <Box width='100%' align='center'>
                            <Heading color='gray.100'>
                                Welcome To DevGag
                            </Heading>
                        </Box>
                    </VStack>

                    <VStack
                        width='250px'
                        margin='0 auto'
                        marginTop='25px'
                        sx={{
                            '& a': {
                                width: '100%',
                            },
                            '& button': {
                                fontSize: 'md',
                            },
                        }}>
                        <Link to={routePaths.feed_jokes.path}>
                            <Button
                                size='lg'
                                isFullWidth
                                colorScheme='green'
                                leftIcon={<Icon as={BiUserCircleIcon} />}>
                                Continue as Guest
                            </Button>
                        </Link>

                        <Box
                            fontWeight='bold'
                            width='100%'
                            align='center'
                            padding='5px 0'
                            color='white'>
                            <Text>OR</Text>
                        </Box>

                        <Link to={routePaths.auth__login.path}>
                            <Button
                                size='lg'
                                isFullWidth
                                colorScheme='facebook'
                                leftIcon={<Icon as={BiLogInIcon} />}>
                                Login
                            </Button>
                        </Link>

                        <Link to={routePaths.auth__signup.path}>
                            <Button
                                size='lg'
                                isFullWidth
                                colorScheme='teal'
                                leftIcon={<Icon as={BiUserPinIcon} />}>
                                Signup
                            </Button>
                        </Link>
                    </VStack>

                    <Box>
                        <Image
                            margin='0 auto'
                            src={BackImage__HappyPeopleSvg}
                            boxSize='100%'
                            maxW='600px'
                            alt='DevGag Welcome People'
                        />
                    </Box>
                </Box>
            </Flex>
        );
    }
}

export default withUserColorModeValue(HomePage);
