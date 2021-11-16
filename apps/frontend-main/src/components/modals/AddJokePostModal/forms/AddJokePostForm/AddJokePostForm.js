import {
    Box,
    Heading,
    VStack,
    HStack,
    Circle,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { MdAddReaction as MdAddReactionIcon } from 'react-icons/md';

import AddJokePostFormControls from './AddJokePostFormControls';

export default function AddJokePostForm(props) {
    const { onSuccessFn, onFailureFn } = props;

    return (
        <Box className='AddJokePostForm'>
            <HStack spacing={4}>
                <Circle
                    bg={useColorModeValue('gray.200', 'gray.300')}
                    padding='10px'>
                    <MdAddReactionIcon fontSize='25px' />
                </Circle>

                <Heading
                    fontSize='1.5rem'
                    color={useColorModeValue(
                        'myBrand.blue.light',
                        'myBrand.blue.dark',
                    )}>
                    Add Joke Post
                </Heading>
            </HStack>

            <VStack spacing={4} align='stretch' paddingTop='20px'>
                <AddJokePostFormControls
                    onSuccessFn={onSuccessFn}
                    onFailureFn={onFailureFn}
                />
            </VStack>
        </Box>
    );
}
