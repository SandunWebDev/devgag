import {
    Avatar,
    Box,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react';
import {
    BiLogOut as BiLogOutIcon,
    BiUserCircle as BiUserCircleIcon,
} from 'react-icons/bi';

import { logoutUser } from '../../../utilities/userAuthentication';

const UserMenu = (props) => {
    const { currentUser = {}, updateCurrentUserData } = props;

    const loggedUsersName = `${currentUser.first_name} ${currentUser.last_name}`;

    return (
        <Popover border='none' offset={[-130, 10]}>
            <PopoverTrigger>
                <Box>
                    <Avatar
                        width='38px'
                        height='38px'
                        fontWeight='bold'
                        color='gray.800'
                        bg='white'
                        cursor='pointer'
                        name={loggedUsersName}
                    />
                </Box>
            </PopoverTrigger>

            <PopoverContent
                bg='gray.100'
                border='2px solid'
                _focus={{ boxShadow: 'none', outline: '0px solid' }}
                padding='10px'
                boxShadow='md'>
                <PopoverArrow bg='gray.100' />
                {/* <PopoverCloseButton /> */}

                <PopoverHeader fontWeight='bold' borderRadius='md'>
                    <Text>{`Hi ${loggedUsersName}`}</Text>
                </PopoverHeader>

                <PopoverBody>
                    <List
                        sx={{
                            li: { padding: '8px 5px' },
                            '& li:hover': {
                                fontWeight: 600,
                                background: 'blue.700',
                                color: 'white',
                                borderRadius: '5',
                            },
                            '& li:hover svg': {
                                color: 'white',
                            },
                        }}>
                        <ListItem cursor='pointer'>
                            <ListIcon as={BiUserCircleIcon} color='blue.500' />
                            Account
                        </ListItem>
                        <ListItem
                            cursor='pointer'
                            onClick={() => {
                                logoutUser({ preventRedirect: true });
                                updateCurrentUserData({}); // Clearing user details in Global Context.
                            }}>
                            <ListIcon as={BiLogOutIcon} color='blue.500' />
                            Log Out
                        </ListItem>
                    </List>
                </PopoverBody>
                <PopoverFooter>
                    <Text fontSize='xs' textAlign='right'>
                        {currentUser.username}
                    </Text>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

export default UserMenu;
