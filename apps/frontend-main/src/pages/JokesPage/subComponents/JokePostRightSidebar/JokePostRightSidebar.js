import { PlusSquareIcon, TriangleUpIcon, RepeatIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    useColorModeValue,
    Divider,
    ButtonGroup,
    Button,
    VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import AddJokePostModal from '../../../../components/modals/AddJokePostModal/AddJokePostModal';
import LoginModal from '../../../../components/modals/LoginModal/LoginModal';
import { checkIsUserLoggedIn } from '../../../../utilities/userAuthentication';

export default function JokePostRightSidebar(props) {
    const { contextState, contextActions } = props;

    const { selectedGenreType } = contextState.jokesFeedPage;
    const { updateSelectedGenreType, updateRefreshRefetch } = contextActions;

    // State to manage "LoginModal" when user clicked "Add Joke Pose" while NotLogged.
    const [isLoginModalOpen, setLoginModalState] = useState(false);
    const [isAddPostModalOpen, setAddPostModalState] = useState(false);

    return (
        <Box
            position='fixed'
            paddingLeft='15px'
            paddingTop='15px'
            borderLeft='2px solid black'
            borderLeftColor={useColorModeValue('gray.200', 'gray.700')}
            minHeight='100%'
            width='100%'
            maxWidth='200px'>
            {/* Modals */}
            <Box>
                <LoginModal
                    trigger={<div />}
                    modalProps={{
                        isOpen: isLoginModalOpen,
                        onCloseClick: () => {
                            setLoginModalState(false);
                        },
                        onSuccessFn: () => {
                            setAddPostModalState(true);
                        },
                    }}
                />

                <AddJokePostModal
                    trigger={<div />}
                    modalProps={{
                        isOpen: isAddPostModalOpen,
                        onCloseClick: () => {
                            setAddPostModalState(false);
                        },
                        onSuccessFn: () => {},
                    }}
                />
            </Box>

            {/* Content */}
            <Box marginBottom='40px'>
                <Flex
                    align='center'
                    justify='center'
                    marginBottom='15px'
                    fontSize='sm'>
                    <Box fontWeight='bold' color='blue.600'>
                        FILTERS
                    </Box>
                    <Divider marginLeft='10px' />
                </Flex>

                <ButtonGroup variant='outline' spacing={0} isAttached>
                    <Button
                        fontSize='sm'
                        bg={selectedGenreType === 'ALL' ? 'blue.700' : ''}
                        color={selectedGenreType === 'ALL' ? 'white' : 'black'}
                        _hover={{ color: 'black', bg: 'gray.300' }}
                        onClick={() => updateSelectedGenreType('ALL')}>
                        ALL
                    </Button>
                    <Button
                        fontSize='sm'
                        bg={selectedGenreType === 'TEXT' ? 'blue.700' : ''}
                        color={selectedGenreType === 'TEXT' ? 'white' : 'black'}
                        _hover={{ color: 'black', bg: 'gray.300' }}
                        onClick={() => updateSelectedGenreType('TEXT')}>
                        TEXT
                    </Button>
                    <Button
                        fontSize='sm'
                        bg={selectedGenreType === 'MEME' ? 'blue.700' : ''}
                        color={selectedGenreType === 'MEME' ? 'white' : 'black'}
                        _hover={{ color: 'black', bg: 'gray.300' }}
                        onClick={() => updateSelectedGenreType('MEME')}>
                        MEME
                    </Button>
                </ButtonGroup>
            </Box>

            <Box marginBottom='40px'>
                <Flex
                    align='center'
                    justify='center'
                    marginBottom='15px'
                    fontSize='sm'>
                    <Box fontWeight='bold' color='blue.600'>
                        NEW&nbsp;POST
                    </Box>
                    <Divider marginLeft='10px' />
                </Flex>

                <Button
                    isFullWidth
                    colorScheme='facebook'
                    color='white'
                    fontSize='sm'
                    leftIcon={<PlusSquareIcon />}
                    onClick={() => {
                        if (checkIsUserLoggedIn()) {
                            setAddPostModalState(true);
                        } else {
                            setLoginModalState(true);
                        }
                    }}>
                    Add Joke Post
                </Button>
            </Box>

            <Box marginBottom='40px'>
                <Flex
                    align='center'
                    justify='center'
                    marginBottom='15px'
                    fontSize='sm'>
                    <Box fontWeight='bold' color='blue.600'>
                        ACTIONS
                    </Box>
                    <Divider marginLeft='10px' />
                </Flex>

                <VStack align='left'>
                    <Button
                        fontSize='sm'
                        leftIcon={<TriangleUpIcon />}
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            });
                        }}>
                        Go To Top
                    </Button>
                    <Button
                        fontSize='sm'
                        leftIcon={<RepeatIcon />}
                        onClick={() => {
                            updateRefreshRefetch(true);
                        }}>
                        Refresh
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
