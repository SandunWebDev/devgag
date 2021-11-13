/* eslint-disable react/sort-comp */
/* eslint-disable unicorn/prefer-spread */

import { Flex, Box } from '@chakra-ui/react';
import React, { Component } from 'react';

import AddJokePostModal from '../../components/modals/AddJokePostModal/AddJokePostModal';
import NavBar from '../../components/NavBar/NavBar';

import JokePostsFeed from './subComponents/JokePostsFeed/JokePostsFeed';

class JokesPage extends Component {
    render() {
        return (
            <div className='JokesPage'>
                <NavBar />

                <Flex
                    maxWidth='1200px'
                    flexWrap='wrap'
                    margin='0 auto'
                    paddingTop='50px'>
                    <Box maxW='200px' flexBasis='200px'>
                        1
                    </Box>
                    <Box flexGrow={1}>
                        <JokePostsFeed />
                    </Box>
                    <Box maxW='200px' flexBasis='200px'>
                        <AddJokePostModal />
                    </Box>
                </Flex>
            </div>
        );
    }
}

export default JokesPage;
