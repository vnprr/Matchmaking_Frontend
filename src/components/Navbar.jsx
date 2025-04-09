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
    Avatar
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
    const { isLoggedIn, email, role } = useAuth();
    const logout = useLogout();

    // Określanie koloru obrysu na podstawie abonamentu (roli)
    const getAvatarBorderColor = () => {
        switch(role) {
            case 'PREMIUM':
                return 'gold';
            case 'PRO':
                return 'blue.500';
            case 'VIP':
                return 'purple.500';
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


// import { Link as RouterLink } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import useLogout from './Logout';
// import {
//     Box,
//     Flex,
//     Text,
//     IconButton,
//     Button,
//     Menu,
//     MenuButton,
//     MenuList,
//     MenuItem,
//     useColorModeValue
// } from '@chakra-ui/react';
// import { HamburgerIcon } from '@chakra-ui/icons';
//
// const Navbar = () => {
//     const { isLoggedIn, email } = useAuth();  // tu trzeba dorobic role
//     const logout = useLogout();
//
//     return (
//         <Box as="nav" bg={useColorModeValue('white', 'gray.800')} py={3} px={4} boxShadow="sm">
//             <Flex align="center" justify="space-between">
//                 <Text
//                     fontWeight="bold"
//                     as={RouterLink}
//                     to="/"
//                 >
//                     Matchmaking
//                 </Text>
//
//                 {/* Menu na większych ekranach */}
//                 <Flex display={{ base: 'none', md: 'flex' }} gap={4} align="center">
//                     {isLoggedIn ? (
//                         <>
//                             <Text>Witaj, {email}</Text>
//                             <Button variant="ghost" as={RouterLink} to="/profile">Profil</Button>
//                             <Button onClick={logout} colorScheme="blue">Wyloguj</Button>
//                         </>
//                     ) : (
//                         <>
//                             <Button variant="ghost" as={RouterLink} to="/login">Logowanie</Button>
//                             <Button as={RouterLink} to="/register" colorScheme="blue">Rejestracja</Button>
//                         </>
//                     )}
//                 </Flex>
//
//                 {/* Menu mobilne */}
//                 <Box display={{ base: 'block', md: 'none' }}>
//                     <Menu>
//                         <MenuButton
//                             as={IconButton}
//                             icon={<HamburgerIcon />}
//                             variant="outline"
//                             aria-label="Menu"
//                         />
//                         <MenuList>
//                             {isLoggedIn ? (
//                                 <>
//                                     <Text p={3}>Witaj, {email}</Text>
//                                     <MenuItem as={RouterLink} to="/profile">Profil</MenuItem>
//                                     <MenuItem onClick={logout}>Wyloguj</MenuItem>
//                                 </>
//                             ) : (
//                                 <>
//                                     <MenuItem as={RouterLink} to="/login">Logowanie</MenuItem>
//                                     <MenuItem as={RouterLink} to="/register">Rejestracja</MenuItem>
//                                 </>
//                             )}
//                         </MenuList>
//                     </Menu>
//                 </Box>
//             </Flex>
//         </Box>
//     );
// };
//
// export default Navbar;