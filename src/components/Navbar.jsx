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
    Badge
} from '@chakra-ui/react';
import { HamburgerIcon, LockIcon, SettingsIcon } from '@chakra-ui/icons';
import { FiUsers, FiSettings } from 'react-icons/fi';

const Navbar = () => {
    const { isLoggedIn, email, role } = useAuth();
    const logout = useLogout();
    const isAdmin = role === 'ADMIN';

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

                            <Avatar
                                size="sm"
                                name={email}
                                src="https://bit.ly/broken-link"
                                border="2px solid"
                                borderColor={getAvatarBorderColor()}
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
                                    <MenuItem icon={
                                        <Avatar
                                            size="sm"
                                            name={email}
                                            border="2px solid"
                                            borderColor={getAvatarBorderColor()}
                                        />
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