import { useEffect, useState } from 'react';
import api from '../services/api';
import {
    Container,
    Box,
    Heading,
    Text,
    Stack,
    Badge,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { role, email } = useAuth();

    // Wywołanie hooków na najwyższym poziomie komponentu
    const bgColor = useColorModeValue('white', 'gray.700');
    const detailsBgColor = useColorModeValue('gray.50', 'gray.600');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/api/user/me');
                setUser(data);
            } catch (error) {
                console.error('Błąd podczas pobierania danych użytkownika:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const getRoleBadgeColor = () => {
        switch(role) {
            case 'PREMIUM': return 'yellow';
            case 'PRO': return 'blue';
            case 'VIP': return 'purple';
            case 'ADMIN': return 'red';
            default: return 'gray';
        }
    };

    return (
        <Container maxW="md" py={8}>
            <Box
                bg={bgColor}
                rounded="xl"
                boxShadow="lg"
                p={6}
            >
                <Heading size="lg" mb={4}>Twój profil</Heading>

                {loading ? (
                    <Spinner />
                ) : (
                    <Stack spacing={3}>
                        <Box>
                            <Text fontWeight="bold" fontSize="sm" color="gray.500">Email:</Text>
                            <Text fontSize="lg">{email}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold" fontSize="sm" color="gray.500">Rola:</Text>
                            <Badge colorScheme={getRoleBadgeColor()} py={1} px={2}>
                                {role || 'USER'}
                            </Badge>
                        </Box>

                        {user && (
                            <Box mt={4}>
                                <Text fontWeight="bold" fontSize="sm" color="gray.500">Szczegóły konta:</Text>
                                <Box
                                    mt={2}
                                    p={3}
                                    bg={detailsBgColor}
                                    borderRadius="md"
                                    fontSize="sm"
                                >
                                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                                        {JSON.stringify(user, null, 2)}
                                    </pre>
                                </Box>
                            </Box>
                        )}
                    </Stack>
                )}
            </Box>
        </Container>
    );
};

export default Profile;

// // src/pages/Profile.jsx
// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import {
//     Container,
//     Box,
//     Heading,
//     Text,
//     Stack,
//     Badge,
//     useColorModeValue,
//     Spinner
// } from '@chakra-ui/react';
// import { useAuth } from '../context/AuthContext';
//
// const Profile = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const { role, email } = useAuth();
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const { data } = await api.get('/api/user/me');
//                 setUser(data);
//             } catch (error) {
//                 console.error('Błąd podczas pobierania danych użytkownika:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUser();
//     }, []);
//
//     const getRoleBadgeColor = () => {
//         switch(role) {
//             case 'PREMIUM': return 'yellow';
//             case 'PRO': return 'blue';
//             case 'VIP': return 'purple';
//             case 'ADMIN': return 'red';
//             default: return 'gray';
//         }
//     };
//
//     return (
//         <Container maxW="md" py={8}>
//             <Box
//                 bg={useColorModeValue('white', 'gray.700')}
//                 rounded="xl"
//                 boxShadow="lg"
//                 p={6}
//             >
//                 <Heading size="lg" mb={4}>Twój profil</Heading>
//
//                 {loading ? (
//                     <Spinner />
//                 ) : (
//                     <Stack spacing={3}>
//                         <Box>
//                             <Text fontWeight="bold" fontSize="sm" color="gray.500">Email:</Text>
//                             <Text fontSize="lg">{email}</Text>
//                         </Box>
//
//                         <Box>
//                             <Text fontWeight="bold" fontSize="sm" color="gray.500">Rola:</Text>
//                             <Badge colorScheme={getRoleBadgeColor()} py={1} px={2}>
//                                 {role || 'USER'}
//                             </Badge>
//                         </Box>
//
//                         {user && (
//                             <Box mt={4}>
//                                 <Text fontWeight="bold" fontSize="sm" color="gray.500">Szczegóły konta:</Text>
//                                 <Box
//                                     mt={2}
//                                     p={3}
//                                     bg={useColorModeValue('gray.50', 'gray.600')}
//                                     borderRadius="md"
//                                     fontSize="sm"
//                                 >
//                                     <pre style={{ whiteSpace: 'pre-wrap' }}>
//                                         {JSON.stringify(user, null, 2)}
//                                     </pre>
//                                 </Box>
//                             </Box>
//                         )}
//                     </Stack>
//                 )}
//             </Box>
//         </Container>
//     );
// };
//
// export default Profile;