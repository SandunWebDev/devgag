import {
    Box,
    Center,
    Heading,
    Text,
    Stack,
    Avatar,
    Image,
    Flex,
    Button,
    ButtonGroup,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import {
    AiOutlineLike as AiOutlineLikeIcon,
    AiOutlineDislike as AiOutlineDislikeIcon,
} from 'react-icons/ai';

import LoginModal from '../../../../components/modals/LoginModal';
import globalValues from '../../../../configs/globalValues';
import { checkIsUserLoggedIn } from '../../../../utilities/userAuthentication';

export default function JokePost(props) {
    const { post, likePost, dislikePost } = props;

    // State to manage "LoginModal" when user clicked "Like/Dislike" while NotLogged.
    const [loginModalState, setLoginModalState] = useState({
        isOpen: false,
        type: undefined,
    });

    const basePath = globalValues.baseURLS.BACKEND_MAIN_STATIC___BASEURL;
    const postType = post.type;

    const createdUser = post.populated__created_by;
    const createdUserName = `${createdUser.first_name} ${createdUser.last_name}`;

    const createdDate = DateTime.fromISO(post.created_at).toLocaleString(
        DateTime.DATETIME_MED,
    );

    return (
        <Center key={post.id} py={6} marginBottom='20px'>
            {loginModalState.isOpen ? (
                <LoginModal
                    trigger={<div />}
                    modalProps={{
                        isOpen: loginModalState.isOpen,
                        onCloseClick: () => {
                            setLoginModalState({
                                isOpen: false,
                                type: undefined,
                            });
                        },
                        onSuccessFn: () => {
                            // eslint-disable-next-line no-unused-expressions
                            loginModalState.type === 'LIKE'
                                ? likePost()
                                : dislikePost();
                        },
                    }}
                />
            ) : (
                ''
            )}

            <Box
                maxW='700px'
                w='100%'
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow='xl'
                rounded='md'
                p={6}
                overflow='hidden'>
                <Box bg='gray.100' mt={-6} mx={-6} mb={6} pos='relative'>
                    {postType === 'MEME' ? (
                        <Image
                            src={`${basePath}/${post.meme_joke}`}
                            fallbackSrc='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGQCAYAAABMPLOTAAAAAXNSR0IArs4c6QAAFk5JREFUeF7t1kENACAQA0HwbwJzBBmQIGMz56DTe3Sus+9wBAgQIECAAAECBKIC0+CNNisWAQIECBAgQIDAFzB4PQIBAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIGrx8gQIAAAQIECBBICxi86XqFI0CAAAECBAgQMHj9AAECBAgQIECAQFrA4E3XKxwBAgQIECBAgIDB6wcIECBAgAABAgTSAgZvul7hCBAgQIAAAQIEDF4/QIAAAQIECBAgkBYweNP1CkeAAAECBAgQIGDw+gECBAgQIECAAIG0gMGbrlc4AgQIECBAgAABg9cPECBAgAABAgQIpAUM3nS9whEgQIAAAQIECBi8foAAAQIECBAgQCAtYPCm6xWOAAECBAgQIEDA4PUDBAgQIECAAAECaQGDN12vcAQIECBAgAABAgavHyBAgAABAgQIEEgLGLzpeoUjQIAAAQIECBAweP0AAQIECBAgQIBAWsDgTdcrHAECBAgQIECAgMHrBwgQIECAAAECBNICBm+6XuEIECBAgAABAgQMXj9AgAABAgQIECCQFjB40/UKR4AAAQIECBAgYPD6AQIECBAgQIAAgbSAwZuuVzgCBAgQIECAAAGD1w8QIECAAAECBAikBQzedL3CESBAgAABAgQIGLx+gAABAgQIECBAIC1g8KbrFY4AAQIECBAgQMDg9QMECBAgQIAAAQJpAYM3Xa9wBAgQIECAAAECBq8fIECAAAECBAgQSAsYvOl6hSNAgAABAgQIEDB4/QABAgQIECBAgEBawOBN1yscAQIECBAgQICAwesHCBAgQIAAAQIE0gIGb7pe4QgQIECAAAECBAxeP0CAAAECBAgQIJAWMHjT9QpHgAABAgQIECBg8PoBAgQIECBAgACBtIDBm65XOAIECBAgQIAAAYPXDxAgQIAAAQIECKQFDN50vcIRIECAAAECBAgYvH6AAAECBAgQIEAgLWDwpusVjgABAgQIECBAwOD1AwQIECBAgAABAmkBgzddr3AECBAgQIAAAQIPSaRZDOppG5UAAAAASUVORK5CYII='
                            width='100%'
                            bg='A0E7E5'
                        />
                    ) : (
                        <Flex
                            align='center'
                            bg='#A0E7E5'
                            padding='15px'
                            minHeight='200px'
                            whiteSpace='pre-line'
                            fontSize='1.4rem'
                            fontStyle='italic'
                            fontWeight={500}>
                            {post.text_joke}
                        </Flex>
                    )}
                </Box>

                <Stack>
                    <Text
                        color='green.500'
                        textTransform='uppercase'
                        fontWeight={800}
                        fontSize='sm'
                        letterSpacing={1.1}>
                        {post.type}
                    </Text>

                    <Heading
                        color={useColorModeValue('gray.700', 'white')}
                        fontSize='xl'
                        fontFamily='body'>
                        {post.title}
                    </Heading>

                    <Text color='gray.500' fontSize='sm'>
                        {post.description}
                    </Text>
                </Stack>

                <Flex align='center'>
                    <Stack mt={6} direction='row' spacing={4} align='center'>
                        <Avatar name={createdUserName} alt='Author' />
                        <Stack direction='column' spacing={0} fontSize='sm'>
                            <Text fontWeight={600}>{createdUserName}</Text>
                            <Text color='gray.500'>{createdDate}</Text>
                        </Stack>
                    </Stack>

                    <Box marginLeft='auto'>
                        <ButtonGroup size='md' isAttached variant='outline'>
                            <Button
                                leftIcon={<Icon as={AiOutlineLikeIcon} />}
                                onClick={() => {
                                    if (checkIsUserLoggedIn()) {
                                        likePost();
                                    } else {
                                        setLoginModalState({
                                            isOpen: true,
                                            type: 'LIKE',
                                        });
                                    }
                                }}>
                                {post.total_likes}
                            </Button>
                            <Button
                                leftIcon={<Icon as={AiOutlineDislikeIcon} />}
                                onClick={() => {
                                    if (checkIsUserLoggedIn()) {
                                        dislikePost();
                                    } else {
                                        setLoginModalState({
                                            isOpen: true,
                                            type: 'DISLIKE',
                                        });
                                    }
                                }}>
                                {post.total_dislikes}
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Flex>
            </Box>
        </Center>
    );
}
