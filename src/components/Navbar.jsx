// src/components/Navbar.jsx
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useLogout from './Logout';
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
    Avatar,
    MenuGroup,
    MenuDivider,
    Badge,
    Spinner
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { HamburgerIcon, LockIcon, SettingsIcon } from '@chakra-ui/icons';
import { FiUsers, FiSettings } from 'react-icons/fi';
import api from '../services/api';
import ProfileAvatar from "./profile/ProfileAvatar.jsx";
import NotificationsMenu from "./NotificationsMenu.jsx";

const Navbar = () => {
    const { isLoggedIn, email, role } = useAuth();
    const logout = useLogout();
    const isAdmin = role === 'ADMIN';
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pobranie zdjęcia profilowego
    useEffect(() => {
        const fetchProfileImage = async () => {
            if (!isLoggedIn) return;

            try {
                setLoading(true);
                const response = await api.get('/api/profile/main-image');
                setProfileImage(response.data?.url || null);
            } catch (err) {
                console.error('Błąd pobierania zdjęcia profilowego:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileImage();
    }, [isLoggedIn]);

    // Określanie koloru obrysu na podstawie abonamentu (roli)
    const getAvatarBorderColor = () => {
        switch(role) {
            case 'ADMIN':
                return 'red.500';
            default:
                return 'gray.300';
        }
    };

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
                            {loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <ProfileAvatar
                                    size="sm"
                                    name={email}
                                />
                                // <Avatar
                                //     size="sm"
                                //     name={email}
                                //     src={profileImage}
                                //     border="2px solid"
                                //     borderColor={getAvatarBorderColor()}
                                //     as={RouterLink}
                                //     to="/profile"
                                // />
                            )}

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
                                    <MenuItem icon={
                                        loading ? (
                                            <Spinner size="sm" />
                                        ) : (
                                            <ProfileAvatar></ProfileAvatar>
                                            // <Avatar
                                            //     size="sm"
                                            //     name={email}
                                            //     src={profileImage}
                                            //     border="2px solid"
                                            //     borderColor={getAvatarBorderColor()}
                                            // />
                                        )
                                    } as={RouterLink} to="/profile">
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