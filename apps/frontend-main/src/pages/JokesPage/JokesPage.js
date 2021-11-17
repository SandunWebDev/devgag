/* eslint-disable react/sort-comp */
/* eslint-disable unicorn/prefer-spread */

import { Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import NavBar from '../../components/NavBar/NavBar';
import chakraCustomTheme from '../../configs/chakraThemeConfig';
import { withGlobalContext } from '../../reactContexts/globalContextor/globalContextor';

import JokePostLeftSidebar from './subComponents/JokePostLeftSidebar/JokePostLeftSidebar';
import JokePostRightSidebar from './subComponents/JokePostRightSidebar/JokePostRightSidebar';
import JokePostsFeed from './subComponents/JokePostsFeed/JokePostsFeed';

function JokesPage(props) {
    return (
        <Box
            className='JokesPage'
            minHeight='calc(100vh - 60px)'
            position='relative'>
            <NavBar />

            {/* Just a space, To hide 'Joke Feed" top moving troughs." */}
            <Box
                position='fixed'
                height={{ base: '20px', xl: '50px' }}
                width='100%'
                bg={useColorModeValue('white', 'gray.800')}
                zIndex='100'
            />

            <Flex
                position='relative'
                height='100%'
                maxWidth='1200px'
                flexWrap='wrap'
                margin='0 auto'
                marginTop={`${chakraCustomTheme.my.navBar.height}px`}
                paddingTop={{ base: '20px', xl: '50px' }}>
                <Box
                    zIndex={100}
                    className='JokesPage__leftSidebar'
                    maxW={{ base: '100%', xl: '200px' }}
                    flexBasis={{ base: '100%', xl: '200px' }}>
                    <JokePostLeftSidebar {...props} />
                </Box>

                <Box
                    className='JokesPage__feed'
                    flexGrow={1}
                    flexShrink={1}
                    width='100%'
                    paddingTop={{ base: '150px', xl: '0px' }}
                    maxW={{ base: '100%', xl: '800px' }}
                    order={{ base: 2, xl: 3 }}>
                    <JokePostsFeed {...props} />
                </Box>

                <Box
                    zIndex={100}
                    className='JokesPage__rightSidebar'
                    maxW={{ base: '100%', xl: '200px' }}
                    flexBasis={{ base: '100%', xl: '200px' }}
                    order={{
                        base: 1,
                        xl: 3,
                    }}>
                    <JokePostRightSidebar {...props} />
                </Box>
            </Flex>
        </Box>
    );
}

export default withGlobalContext(JokesPage);
