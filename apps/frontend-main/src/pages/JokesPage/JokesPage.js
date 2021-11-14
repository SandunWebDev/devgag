/* eslint-disable react/sort-comp */
/* eslint-disable unicorn/prefer-spread */

import { Flex, Box } from '@chakra-ui/react';
import React, { Component } from 'react';

import NavBar from '../../components/NavBar/NavBar';
import chakraCustomTheme from '../../configs/chakraThemeConfig';
import { withGlobalContext } from '../../reactContexts/globalContextor/globalContextor';

import JokePostLeftSidebar from './subComponents/JokePostLeftSidebar/JokePostLeftSidebar';
import JokePostRightSidebar from './subComponents/JokePostRightSidebar/JokePostRightSidebar';
import JokePostsFeed from './subComponents/JokePostsFeed/JokePostsFeed';

class JokesPage extends Component {
    render() {
        return (
            <Box className='JokesPage' minHeight='calc(100vh - 60px)'>
                <NavBar />

                <Flex
                    height='100%'
                    maxWidth='1200px'
                    flexWrap='wrap'
                    margin='0 auto'
                    marginTop={`${chakraCustomTheme.my.navBar.height}px`}
                    paddingTop='50px'>
                    <Box
                        maxW='200px'
                        flexBasis='200px'
                        display={{ base: 'none', lg: 'block' }}>
                        <JokePostLeftSidebar {...this.props} />
                    </Box>

                    <Box flexGrow={1}>
                        <JokePostsFeed {...this.props} />
                    </Box>

                    <Box
                        maxW='200px'
                        flexBasis='200px'
                        display={{ base: 'none', lg: 'block' }}>
                        <JokePostRightSidebar {...this.props} />
                        {/* <AddJokePostModal /> */}
                    </Box>
                </Flex>
            </Box>
        );
    }
}

export default withGlobalContext(JokesPage);
