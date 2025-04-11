// src/pages/Profile.jsx
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
    Spinner,
    Flex,
    Image,
    Center,
    Divider,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        bio: ''
    });
    const [profileImages, setProfileImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { role, email } = useAuth();
    const bgColor = useColorModeValue('white', 'gray.700');

    // Pobranie danych profilu i zdjęć
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Pobieranie danych profilu
                const profileResponse = await api.get('/api/profile');
                setProfile(profileResponse.data);

                // Pobieranie zdjęć profilu
                const imagesResponse = await api.get('/api/profile/images');
                setProfileImages(imagesResponse.data);

            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
                setError('Wystąpił błąd podczas pobierania danych profilu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Wyliczenie wieku na podstawie daty urodzenia
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;

        const birthDate = new Date(dateOfBirth);
        if (isNaN(birthDate.getTime())) return null;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const getRoleBadgeColor = () => {
        switch(role) {
            case 'PREMIUM': return 'yellow';
            case 'PRO': return 'blue';
            case 'VIP': return 'purple';
            case 'ADMIN': return 'red';
            default: return 'gray';
        }
    };

    // Znalezienie głównego zdjęcia profilowego
    const getMainImage = () => {
        if (profileImages && profileImages.length > 0) {
            const mainImage = profileImages.find(img => img.main);
            if (mainImage) return mainImage.imageUrl;
            return profileImages[0].imageUrl; // Jeśli nie ma zdjęcia głównego, użyj pierwszego
        }
        return "https://via.placeholder.com/300"; // Zdjęcie domyślne
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('pl-PL');
    };

    return (
        <Container maxW="4xl" py={8}>
            <Box
                bg={bgColor}
                rounded="xl"
                boxShadow="lg"
                p={6}
                overflow="hidden"
            >
                {error && (
                    <Alert status="error" mb={4} rounded="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Center py={10}>
                        <Spinner size="xl" />
                    </Center>
                ) : (
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap={{ base: 6, md: 8 }}
                        align="start"
                    >
                        {/* Lewa kolumna ze zdjęciem */}
                        <Box
                            flex={{ base: '1', md: '2' }}
                            mb={{ base: 4, md: 0 }}
                            textAlign="center"
                        >
                            <Image
                                src={getMainImage()}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                borderRadius="lg"
                                boxSize="300px"
                                objectFit="cover"
                                mx="auto"
                                boxShadow="md"
                            />
                            <Badge
                                colorScheme={getRoleBadgeColor()}
                                py={1}
                                px={3}
                                mt={3}
                                borderRadius="full"
                                fontSize="sm"
                            >
                                {role || 'USER'}
                            </Badge>
                        </Box>

                        {/* Prawa kolumna z informacjami */}
                        <Box flex={{ base: '1', md: '3' }}>
                            <Heading as="h2" size="xl" mb={4}>
                                {profile.firstName} {profile.lastName}
                            </Heading>

                            <Divider my={4} />

                            <Stack spacing={3}>
                                {calculateAge(profile.dateOfBirth) && (
                                    <Flex>
                                        <Text fontWeight="bold" width="120px">Wiek:</Text>
                                        <Text>{calculateAge(profile.dateOfBirth)} lat</Text>
                                    </Flex>
                                )}

                                {profile.gender && (
                                    <Flex>
                                        <Text fontWeight="bold" width="120px">Płeć:</Text>
                                        <Text>{profile.gender === 'MALE' ? 'Mężczyzna' : 'Kobieta'}</Text>
                                    </Flex>
                                )}

                                {profile.dateOfBirth && (
                                    <Flex>
                                        <Text fontWeight="bold" width="120px">Data urodzenia:</Text>
                                        <Text>{formatDate(profile.dateOfBirth)}</Text>
                                    </Flex>
                                )}

                                {profile.bio && (
                                    <Box mt={4}>
                                        <Text fontWeight="bold" mb={2}>O mnie:</Text>
                                        <Box
                                            p={3}
                                            bg={useColorModeValue('gray.50', 'gray.600')}
                                            borderRadius="md"
                                        >
                                            <Text>{profile.bio}</Text>
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Flex>
                )}
            </Box>
        </Container>
    );
};

export default Profile;