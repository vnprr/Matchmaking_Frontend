// src/components/Navbar.jsx
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import useLogout from '../Logout.jsx';
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    MenuGroup,
    MenuDivider,
    Badge
} from '@chakra-ui/react';
import { HamburgerIcon, LockIcon, SettingsIcon } from '@chakra-ui/icons';
import { FiUsers, FiSettings } from 'react-icons/fi';
import ProfileAvatar from "../profile/ProfileAvatar.jsx";
import NotificationsMenu from "./NotificationsMenu.jsx";
import NavbarChatIcon from "./ChatIcon.jsx";

const Navbar = () => {
    const { isLoggedIn, email, role } = useAuth();
    const logout = useLogout();
    const isAdmin = role === 'ADMIN';

    return (
        <Box as="nav" bg={useColorModeValue('white', 'gray.800')} py={3} px={4} boxShadow="sm">
            <Flex align="center" justify="space-between">
                <Text
                    fontWeight="bold"
                    as={RouterLink}
                    to="/"
                >
                    Matchmaking
                </Text>

                {/* Menu na większych ekranach */}
                <Flex display={{ base: 'none', md: 'flex' }} gap={4} align="center">
                    {isLoggedIn ? (
                        <>
                            <Button variant="ghost" as={RouterLink} to="/profile">Profil</Button>

                            {isAdmin && (
                                <Button
                                    variant="ghost"
                                    as={RouterLink}
                                    to="/admin"
                                    leftIcon={<SettingsIcon />}
                                    colorScheme="red"
                                >
                                    Panel admina
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                as={RouterLink}
                                to="/account-security"
                                leftIcon={<LockIcon />}
                            >
                                Bezpieczeństwo
                            </Button>

                            <Button onClick={logout} colorScheme="blue">Wyloguj</Button>
                            <NotificationsMenu />
                            <NavbarChatIcon />
                            <ProfileAvatar
                                size="sm"
                                name={email}
                                as={RouterLink}
                                to="/profile"
                            />

                            {isAdmin && (
                                <Badge colorScheme="red">Admin</Badge>
                            )}
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" as={RouterLink} to="/login">Logowanie</Button>
                            <Button as={RouterLink} to="/register" colorScheme="blue">Rejestracja</Button>
                        </>
                    )}
                </Flex>

                {/* Menu mobilne */}
                <Box display={{ base: 'block', md: 'none' }}>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            icon={<HamburgerIcon />}
                            variant="outline"
                            aria-label="Menu"
                        />
                        <MenuList>
                            {isLoggedIn ? (
                                <>
                                    <MenuItem icon={<ProfileAvatar size="sm" />} as={RouterLink} to="/profile">
                                        Profil
                                    </MenuItem>

                                    <MenuItem
                                        icon={<LockIcon />}
                                        as={RouterLink}
                                        to="/account-security"
                                    >
                                        Bezpieczeństwo konta
                                    </MenuItem>

                                    {isAdmin && (
                                        <>
                                            <MenuDivider />
                                            <MenuGroup title="Panel administracyjny">
                                                <MenuItem
                                                    icon={<SettingsIcon />}
                                                    as={RouterLink}
                                                    to="/admin"
                                                >
                                                    Kokpit admina
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<FiUsers />}
                                                    as={RouterLink}
                                                    to="/admin/users"
                                                >
                                                    Zarządzanie użytkownikami
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<FiSettings />}
                                                    as={RouterLink}
                                                    to="/admin/config"
                                                >
                                                    Konfiguracja systemu
                                                </MenuItem>
                                            </MenuGroup>
                                            <MenuDivider />
                                        </>
                                    )}

                                    <MenuItem onClick={logout}>Wyloguj</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem as={RouterLink} to="/login">Logowanie</MenuItem>
                                    <MenuItem as={RouterLink} to="/register">Rejestracja</MenuItem>
                                </>
                            )}
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>
        </Box>
    );
};

export default Navbar;
