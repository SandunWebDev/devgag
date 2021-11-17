/* eslint-disable sonarjs/no-all-duplicated-branches */

import { PlusSquareIcon, TriangleUpIcon, RepeatIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    useColorModeValue,
    useColorMode,
    Divider,
    ButtonGroup,
    Button,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
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
            transform={{ base: 'translateY(50px)', xl: 'translateY(0px)' }}
            paddingLeft='15px'
            paddingTop='15px'
            borderLeft='2px solid black'
            borderLeftColor={useColorModeValue('gray.200', 'gray.700')}
            minHeight='100%'
            width='100%'
            maxWidth={{ base: '100%', xl: '200px' }}>
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

            <Box
                bg={useColorModeValue('white', 'gray.800')}
                width='100%'
                pos='absolute'
                padding='10px'
                left={0}
                paddingBottom='30px'
                display={{ base: 'block', xl: 'none' }}>
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton
                                bg={useColorModeValue('gray.200', 'gray.800')}
                                _hover={{
                                    bg: useColorModeValue(
                                        'gray.300',
                                        'gray.700',
                                    ),
                                }}>
                                <Box
                                    flex='1'
                                    textAlign='left'
                                    fontWeight='bold'>
                                    OPTIONS
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel
                            pb={4}
                            bg={useColorModeValue('white', 'gray.800')}
                            paddingTop='15px'
                            border='1px solid'
                            borderColor={useColorModeValue(
                                'gray.300',
                                'gray.600',
                            )}>
                            <Flex justify='center'>
                                <Box maxWidth='400px' width='100%'>
                                    <SidebarContent
                                        selectedGenreType={selectedGenreType}
                                        updateSelectedGenreType={
                                            updateSelectedGenreType
                                        }
                                        setAddPostModalState={
                                            setAddPostModalState
                                        }
                                        setLoginModalState={setLoginModalState}
                                        updateRefreshRefetch={
                                            updateRefreshRefetch
                                        }
                                    />
                                </Box>
                            </Flex>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>

            {/* On Desktop Resolutions */}
            <Box display={{ base: 'none', xl: 'block' }}>
                <SidebarContent
                    selectedGenreType={selectedGenreType}
                    updateSelectedGenreType={updateSelectedGenreType}
                    setAddPostModalState={setAddPostModalState}
                    setLoginModalState={setLoginModalState}
                    updateRefreshRefetch={updateRefreshRefetch}
                />
            </Box>
        </Box>
    );
}

const SidebarContent = (props) => {
    const {
        selectedGenreType,
        updateSelectedGenreType,
        setAddPostModalState,
        setLoginModalState,
        updateRefreshRefetch,
    } = props;

    const { colorMode } = useColorMode();

    const btnGroupSelectedBgColor =
        colorMode === 'light' ? 'blue.700' : 'blue.600';
    const btnGroupSelectedFontColor = colorMode === 'light' ? 'white' : 'white';

    const btnGroupUnselectedBgColor =
        colorMode === 'light' ? 'white' : 'transparent';
    const btnGroupUnselectedFontColor =
        colorMode === 'light' ? 'gray.900' : 'white';

    return (
        <Box>
            <Box marginBottom='40px'>
                <Flex
                    align='center'
                    justify='center'
                    marginBottom='15px'
                    fontSize='sm'>
                    <Box
                        fontWeight='bold'
                        color={useColorModeValue('blue.600', 'white')}>
                        FILTERS
                    </Box>
                    <Divider
                        marginLeft='10px'
                        borderColor={useColorModeValue('gray.400', 'gray.100')}
                    />
                </Flex>

                <ButtonGroup variant='outline' spacing={0} isAttached>
                    <Button
                        fontSize='sm'
                        bg={
                            selectedGenreType === 'ALL'
                                ? btnGroupSelectedBgColor
                                : btnGroupUnselectedBgColor
                        }
                        color={
                            selectedGenreType === 'ALL'
                                ? btnGroupSelectedFontColor
                                : btnGroupUnselectedFontColor
                        }
                        _hover={{ color: 'black', bg: 'gray.300' }}
                        onClick={() => updateSelectedGenreType('ALL')}>
                        ALL
                    </Button>
                    <Button
                        fontSize='sm'
                        bg={
                            selectedGenreType === 'TEXT'
                                ? btnGroupSelectedBgColor
                                : btnGroupUnselectedBgColor
                        }
                        color={
                            selectedGenreType === 'TEXT'
                                ? btnGroupSelectedFontColor
                                : btnGroupUnselectedFontColor
                        }
                        _hover={{ color: 'black', bg: 'gray.300' }}
                        onClick={() => updateSelectedGenreType('TEXT')}>
                        TEXT
                    </Button>
                    <Button
                        fontSize='sm'
                        bg={
                            selectedGenreType === 'MEME'
                                ? btnGroupSelectedBgColor
                                : btnGroupUnselectedBgColor
                        }
                        color={
                            selectedGenreType === 'MEME'
                                ? btnGroupSelectedFontColor
                                : btnGroupUnselectedFontColor
                        }
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
                    <Box
                        fontWeight='bold'
                        color={useColorModeValue('blue.600', 'white')}>
                        NEW&nbsp;POST
                    </Box>
                    <Divider
                        marginLeft='10px'
                        borderColor={useColorModeValue('gray.400', 'gray.100')}
                    />
                </Flex>

                <Button
                    isFullWidth
                    bg={useColorModeValue('blue.700', 'blue.600')}
                    color='white'
                    _hover={{
                        background: useColorModeValue('blue.800', 'gray.300'),
                        color: useColorModeValue('white', 'gray.900'),
                    }}
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
                    <Box
                        fontWeight='bold'
                        color={useColorModeValue('blue.600', 'white')}>
                        ACTIONS
                    </Box>
                    <Divider
                        marginLeft='10px'
                        borderColor={useColorModeValue('gray.400', 'gray.100')}
                    />
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
};
