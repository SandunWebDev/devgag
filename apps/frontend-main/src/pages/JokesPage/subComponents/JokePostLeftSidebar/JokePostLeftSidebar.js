import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import {
    FaHotjar as FaHotjarIcon,
    FaAirFreshener as FaAirFreshenerIcon,
} from 'react-icons/fa';
import {
    FiHome as FiHomeIcon,
    FiMenu as FiMenuIcon,
    FiTrendingUp as FiTrendingUpIcon,
    FiStar as FiStarIcon,
} from 'react-icons/fi';

const LinkItems = [
    { name: 'General', icon: FiHomeIcon },
    { name: 'Hot', icon: FaHotjarIcon },
    { name: 'Trending', icon: FiTrendingUpIcon },
    { name: 'Fresh', icon: FaAirFreshenerIcon },
    { name: 'Favorites', icon: FiStarIcon },
];

export default function JokePostLeftSidebar(props) {
    const { contextState, contextActions } = props;

    const { selectedTrendType } = contextState.jokesFeedPage;
    const { updateSelectedTrendType, updateRefreshRefetch } = contextActions;

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box className='JokePostLeftSidebar'>
            {/* On Desktop Resolutions */}
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', xl: 'block' }}
                selectedTrendType={selectedTrendType}
                updateSelectedTrendType={updateSelectedTrendType}
                updateRefreshRefetch={updateRefreshRefetch}
            />

            {/* On Mobile Resolutions */}
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size='full'>
                <DrawerContent bg={useColorModeValue('white', 'gray.800')}>
                    <SidebarContent
                        onClose={onClose}
                        selectedTrendType={selectedTrendType}
                        updateSelectedTrendType={updateSelectedTrendType}
                        updateRefreshRefetch={updateRefreshRefetch}
                    />
                </DrawerContent>
            </Drawer>

            <MobileNav display={{ base: 'flex', xl: 'none' }} onOpen={onOpen} />
        </Box>
    );
}

const SidebarContent = ({
    onClose,
    selectedTrendType,
    updateSelectedTrendType,
    updateRefreshRefetch,
    ...rest
}) => {
    return (
        <Box
            className='leftMenu'
            borderRight='1px'
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', xl: 60 }}
            pos='fixed'
            h='full'
            {...rest}>
            <Flex
                h='20'
                alignItems='center'
                mx='8'
                justifyContent='space-between'>
                <Text
                    marginLeft='-10px'
                    fontSize='2xl'
                    fontFamily='monospace'
                    fontWeight='bold'
                    color='blue.500'>
                    JOKES
                </Text>
                <CloseButton
                    display={{ base: 'flex', xl: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem
                    key={link.name}
                    icon={link.icon}
                    borderLeft={
                        selectedTrendType.toLowerCase() ===
                        link.name.toLowerCase()
                            ? '4px solid'
                            : ''
                    }
                    borderColor='blue.600'
                    onClick={() => {
                        updateSelectedTrendType(link.name.toUpperCase(), () => {
                            updateRefreshRefetch(true);
                        });
                    }}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Link href='#' style={{ textDecoration: 'none' }}>
            <Flex
                align='center'
                p='3'
                mx='4'
                borderRadius='lg'
                role='group'
                cursor='pointer'
                _hover={{
                    bg: 'blue.700',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr='4'
                        fontSize='16'
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ onOpen, ...rest }) => {
    return (
        <Flex
            pos='fixed'
            width='100%'
            ml={{ base: 0, xl: 60 }}
            px={{ base: 4, xl: 24 }}
            height='20'
            alignItems='center'
            bg={useColorModeValue('white', 'gray.800')}
            borderBottomWidth='1px'
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent='flex-start'
            {...rest}>
            <IconButton
                variant='outline'
                onClick={onOpen}
                aria-label='open menu'
                icon={<FiMenuIcon />}
            />

            <Text
                ml='10px'
                fontSize='2xl'
                fontFamily='monospace'
                fontWeight='bold'
                color='blue.500'>
                JOKES
            </Text>
        </Flex>
    );
};
