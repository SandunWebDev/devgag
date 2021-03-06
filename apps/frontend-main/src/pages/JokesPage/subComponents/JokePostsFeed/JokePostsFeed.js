/* eslint-disable react/destructuring-assignment */
/* eslint-disable unicorn/prefer-spread */
/* eslint-disable react/sort-comp */

import {
    Spinner,
    Flex,
    Center,
    Icon,
    Text,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Box,
} from '@chakra-ui/react';
import React, { Component } from 'react';
import { AiOutlineBuild as AiOutlineBuildIcon } from 'react-icons/ai';
import { BiRefresh as BiRefreshIcon } from 'react-icons/bi';
import {
    BsArrowDownSquare as BsArrowDownSquareIcon,
    BsArrowUpSquare as BsArrowUpSquareIcon,
} from 'react-icons/bs';
import { MdLegendToggle as MdLegendToggleIcon } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

import {
    getAllJokePosts,
    likeOnePost,
} from '../../../../utilities/apiRequests/backendMainApiRequests';

import JokePost from './JokePost';

export default class JokePostsFeed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Related to Fetching Post
            isPostFetchError: false,
            startDate: new Date().toISOString(), // To maintain each fetch is from pre-determined point. So newly added post wont affect page order.
            currentPage: 0,
            totalPages: undefined,
            postList: [],
        };
    }

    async getAllJokePosts() {
        // Getting all posts per current page.

        const { startDate, currentPage, totalPages, postList } = this.state;

        const { contextState } = this.props;
        const { jokesFeedPage } = contextState;

        try {
            // Check if there more pages to be fetched.
            if (totalPages !== undefined && currentPage > totalPages) {
                return;
            }

            this.setState({
                isPostFetchError: false,
            });

            const pagePostListResp = await getAllJokePosts({
                page: currentPage + 1,
                per_page: 20,
                start_date: startDate,
                trend_type: jokesFeedPage.selectedTrendType, // Must be one of: GENERAL, HOT, TRENDING, FRESH, FAVORITES
            });

            this.setState({
                postList: [...postList].concat(pagePostListResp.jokePostList),
                currentPage: currentPage + 1,
                totalPages: pagePostListResp.meta.total_pages,
            });
        } catch (error) {
            this.setState({
                isPostFetchError: error.customErrMsg || error.message,
            });
        }
    }

    async likePost(
        post_id,
        like = 1, // 1 --> Like AND -1 --> DisLike
    ) {
        const { postList } = this.state;

        try {
            const likePostRes = await likeOnePost({ post_id, like });

            const modifiedPostList = [...postList];
            const postIndex = modifiedPostList.findIndex(
                (i) => i.id === post_id,
            );

            modifiedPostList[postIndex] = likePostRes.updatedPostData;

            this.setState({
                postList: modifiedPostList,
            });
        } catch (error) {
            const customErrMsg = error.customErrMsg || error.message;

            // Ignoring some specific errors. Since these are not critical.
            if (customErrMsg.includes('User already liked/disliked')) {
                toast.info(
                    `You have already ${
                        like === 1 ? 'liked' : 'disliked'
                    } this post.`,
                );

                // eslint-disable-next-line consistent-return
                return;
            }

            throw new Error(error);
        }
    }

    async componentDidMount() {
        await this.getAllJokePosts();
    }

    getFilteredPostList() {
        const { postList } = this.state;
        const { contextState } = this.props;
        const { selectedGenreType } = contextState.jokesFeedPage;

        switch (selectedGenreType) {
            case 'TEXT': {
                return postList.filter((post) => {
                    return post.type === 'TEXT';
                });
            }

            case 'MEME': {
                return postList.filter((post) => {
                    return post.type === 'MEME';
                });
            }

            case 'ALL':
            default: {
                return postList;
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.contextState.jokesFeedPage.refreshRefetch !==
                this.props.contextState.jokesFeedPage.refreshRefetch &&
            this.props.contextState.jokesFeedPage.refreshRefetch
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(
                {
                    startDate: new Date().toISOString(),
                    currentPage: 0,
                    totalPages: undefined,
                    postList: [],
                },
                () => {
                    this.getAllJokePosts();
                    this.props.contextActions.updateRefreshRefetch(false);
                },
            );
        }
    }

    render() {
        const { isPostFetchError, currentPage, totalPages } = this.state;

        const filteredPostList = this.getFilteredPostList();

        return (
            <InfiniteScroll
                width='100%'
                dataLength={filteredPostList.length} // This is important field to render the next data
                next={async () => await this.getAllJokePosts()}
                hasMore={currentPage === 0 || currentPage < totalPages}
                loader={
                    isPostFetchError ? (
                        <Center marginBottom='40px'>
                            <Alert
                                status='error'
                                variant='subtle'
                                flexDirection='column'
                                alignItems='center'
                                justifyContent='center'
                                textAlign='center'
                                height='200px'
                                maxW='685px'>
                                <AlertIcon boxSize='40px' mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize='lg'>
                                    Error Occurred
                                </AlertTitle>
                                <AlertDescription maxWidth='sm'>
                                    <VStack>
                                        <Text>
                                            Error occurred while fetching posts.
                                        </Text>
                                        <Button
                                            colorScheme='blue'
                                            fontSize='sm'
                                            leftIcon={
                                                <Icon as={BiRefreshIcon} />
                                            }
                                            onClick={() =>
                                                this.getAllJokePosts()
                                            }>
                                            Fetch Again
                                        </Button>
                                    </VStack>
                                </AlertDescription>
                            </Alert>
                        </Center>
                    ) : (
                        <Flex align='center' justify='center' minHeight='300px'>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        </Flex>
                    )
                }
                endMessage={
                    <Center marginY='40px'>
                        <VStack>
                            {filteredPostList.length > 0 ? (
                                <Box align='center'>
                                    <Icon
                                        as={MdLegendToggleIcon}
                                        boxSize={12}
                                    />
                                    <Text fontWeight='bold'>
                                        Yay! You have seen it all.
                                    </Text>
                                </Box>
                            ) : (
                                <Box align='center' marginTop='40px'>
                                    <Icon
                                        as={AiOutlineBuildIcon}
                                        boxSize={12}
                                    />
                                    <Text fontWeight='bold'>
                                        Nothing to Show.
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </Center>
                }
                scrollThreshold={0.95}
                // Below props are for  "Pull Down" functionality.
                refreshFunction={() => {
                    this.setState(
                        {
                            startDate: new Date().toISOString(),
                            currentPage: 0,
                            totalPages: undefined,
                            postList: [],
                        },
                        () => {
                            this.getAllJokePosts();
                        },
                    );
                }}
                pullDownToRefresh
                pullDownToRefreshThreshold={90}
                pullDownToRefreshContent={
                    <Center marginTop='100px'>
                        <VStack>
                            <Icon as={BsArrowDownSquareIcon} boxSize={10} />
                            <Text fontWeight='bold'>Pull Down To Refresh</Text>
                        </VStack>
                    </Center>
                }
                releaseToRefreshContent={
                    <Center marginTop='100px'>
                        <VStack>
                            <Icon as={BsArrowUpSquareIcon} boxSize={10} />
                            <Text fontWeight='bold'>Release To Refresh</Text>
                        </VStack>
                    </Center>
                }>
                {filteredPostList.map((post) => {
                    return (
                        <JokePost
                            post={post}
                            likePost={() => this.likePost(post.id, 1)}
                            dislikePost={() => this.likePost(post.id, -1)}
                        />
                    );
                })}
            </InfiniteScroll>
        );
    }
}
