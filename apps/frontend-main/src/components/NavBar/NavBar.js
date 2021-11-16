import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    Icon,
    Image,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Square,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import { SiBuzzfeed as SiBuzzfeedIcon } from 'react-icons/si';

import DevGagLogoWithoutTextSvg from '../../assets/svg/devgag_logo_without_text.svg';
import chakraCustomTheme from '../../configs/chakraThemeConfig';
import { withGlobalContext } from '../../reactContexts/globalContextor/globalContextor';
import { routePaths } from '../../routes/routeConstants';
import routerHistory from '../../utilities/routerHistory';
import { checkIsUserLoggedIn } from '../../utilities/userAuthentication';
import LoginModal from '../modals/LoginModal/LoginModal';
import DarkModeToggler from '../widgets/DarkModeToggler/DarkModeToggler';

import UserMenu from './subComponents/UserMenu';

const NAV_ITEMS = [
    {
        label: 'FEEDS',
        icon: SiBuzzfeedIcon,
        children: [
            {
                label: 'Joke Posts',
                subLabel: 'Explore Joke Posts',
                href: routePaths.feed_jokes.path,
            },
            {
                label: 'Rant Posts',
                subLabel: 'Coming Soon',
                href: routePaths.feed_rants.path,
            },
        ],
    },
    // {
    //     label: 'About',
    //     href: '#',
    // },
];

function NavBar(props) {
    const { contextState, contextActions } = props;

    const { isOpen, onToggle } = useDisclosure();
    const isUserLogged = checkIsUserLoggedIn();

    return (
        <Box position='fixed' top={0} width='100%' zIndex='1000'>
            <Flex
                bg={useColorModeValue('blue.800', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={`${chakraCustomTheme.my.navBar.height}px`}
                maxH={`${chakraCustomTheme.my.navBar.height}px`}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle='solid'
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align='center'>
                {/* Mobile Burger Menu Toggler */}
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? (
                                <CloseIcon w={3} h={3} />
                            ) : (
                                <HamburgerIcon w={5} h={5} />
                            )
                        }
                        variant='ghost'
                        aria-label='Toggle Mobile Menu'
                    />
                </Flex>

                {/* Nav Left Side */}
                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: 'center', md: 'start' }}
                    align='center'>
                    <Flex
                        borderRight='2px solid #ffffff19'
                        paddingRight='30px'
                        align='center'
                        cursor='pointer'
                        onClick={() =>
                            routerHistory.push(routePaths.root.path)
                        }>
                        <Square>
                            <Image
                                src={DevGagLogoWithoutTextSvg}
                                alt='DevGag Logo'
                                height='50px'
                            />
                        </Square>

                        <Text
                            textAlign={useBreakpointValue({
                                base: 'center',
                                md: 'left',
                            })}
                            fontFamily='heading'
                            fontSize='xl'
                            color={useColorModeValue('gray.100', 'white')}>
                            DevGag
                        </Text>
                    </Flex>

                    {/* Main Menu List */}
                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav />
                    </Flex>
                </Flex>

                {/* Nav Right Side */}
                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify='flex-end'
                    align='center'
                    direction='row'
                    spacing={3}>
                    <DarkModeToggler
                        variant='ghost'
                        color='white'
                        _hover={{
                            background: 'gray.200',
                            color: 'black',
                        }}
                    />

                    {isUserLogged ? (
                        <UserMenu
                            currentUser={contextState.currentUser}
                            updateCurrentUserData={
                                contextActions.updateCurrentUserData
                            }
                        />
                    ) : (
                        <LoginModal />
                    )}
                </Stack>
            </Flex>

            {/* Mobile Menu */}
            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

export default withGlobalContext(NavBar);

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.100', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.300', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction='row' spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger='hover' placement='bottom-start'>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize='1rem'
                                fontWeight={600}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                <Flex align='center'>
                                    <Icon
                                        as={SiBuzzfeedIcon}
                                        marginRight='5px'
                                        marginTop='-3px'
                                        fontSize='16px'
                                    />
                                    <Text>{navItem.label}</Text>
                                </Flex>
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow='xl'
                                bg={popoverContentBgColor}
                                p={4}
                                rounded='xl'
                                minW='sm'>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav
                                            key={child.label}
                                            {...child}
                                        />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
    return (
        <Link
            href={href}
            role='group'
            display='block'
            p={2}
            rounded='md'
            _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}>
            <Stack direction='row' align='center'>
                <Box>
                    <Text
                        transition='all .3s ease'
                        _groupHover={{ color: 'blue.400' }}
                        fontWeight={600}>
                        {label}
                    </Text>
                    <Text fontSize='sm'>{subLabel}</Text>
                </Box>

                <Flex
                    transition='all .3s ease'
                    transform='translateX(-10px)'
                    opacity={0}
                    _groupHover={{
                        opacity: '100%',
                        transform: 'translateX(0)',
                    }}
                    justify='flex-end'
                    align='center'
                    flex={1}>
                    <Icon color='blue.400' w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue('gray.100', 'gray.800')}
            p={4}
            display={{ md: 'none' }}
            position='absolute'
            left={0}
            right={0}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify='space-between'
                align='center'
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>

                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition='all .25s ease-in-out'
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse
                in={isOpen}
                animateOpacity
                style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle='solid'
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align='start'>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};
