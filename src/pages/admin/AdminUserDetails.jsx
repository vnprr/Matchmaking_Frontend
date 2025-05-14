// src/pages/admin/AdminUserDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    Container,
    Box,
    Heading,
    Button,
    Divider,
    useColorModeValue,
    Alert,
    AlertIcon,
    useToast,
    Spinner,
    Flex
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import AdminUserStats from '../../components/admin/AdminUserStats';
import AdminUserSecurity from '../../components/admin/AdminUserSecurity';
import AdminUserProfileForm from '../../components/admin/AdminUserProfileForm';
import AdminUserAccountForm from '../../components/admin/AdminUserAccountForm';
import AdminUserRecommendations from '../../components/admin/AdminUserRecommendations';

const AdminUserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const bgColor = useColorModeValue('white', 'gray.700');
    const statBgColor = useColorModeValue('blue.50', 'blue.900');

    // Pobranie danych użytkownika
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/admin/users/${userId}`);
                setUserData(response.data);
            } catch (err) {
                setError('Nie udało się pobrać danych użytkownika');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    // Obsługa zmiany danych
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Obsługa zmiany daty urodzenia
    const handleDateChange = (e) => {
        setUserData({
            ...userData,
            dateOfBirth: e.target.value
        });
    };

    // Zapisywanie zmian
    const handleSubmit = async (e, newPassword = null) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Przygotowanie danych do wysłania
            const updatedData = {
                ...userData,
                newPassword: newPassword || null
            };

            await api.put(`/api/admin/users/${userId}`, updatedData);

            setSuccess('Dane użytkownika zostały zaktualizowane');

            toast({
                title: 'Zapisano zmiany',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd podczas zapisywania zmian');

            toast({
                title: 'Błąd',
                description: err.response?.data?.message || 'Nie udało się zapisać zmian',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setSaving(false);
        }
    };

    // Zmiana statusu konta (blokowanie/odblokowanie)
    const toggleAccountStatus = async () => {
        try {
            await api.put(`/api/admin/users/${userId}/disable`);

            setUserData({
                ...userData,
                enabled: !userData.enabled
            });

            toast({
                title: userData.enabled ? 'Konto zablokowane' : 'Konto odblokowane',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch (err) {
            // Ustawiamy błąd w stanie zamiast nieużywanej zmiennej
            setError('Nie udało się zmienić statusu konta');
            toast({
                title: 'Błąd',
                description: 'Nie udało się zmienić statusu konta',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };

    // Resetowanie licznika nieudanych prób logowania
    const resetLoginAttempts = async () => {
        try {
            await api.put(`/api/admin/users/${userId}/reset-login-attempts`);

            setUserData({
                ...userData,
                failedLoginAttempts: 0,
                accountLockedUntil: null
            });

            toast({
                title: 'Zresetowano licznik nieudanych prób logowania',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch (err) {
            // Ustawiamy błąd w stanie zamiast nieużywanej zmiennej
            setError('Nie udało się zresetować licznika prób logowania');
            toast({
                title: 'Błąd',
                description: 'Nie udało się zresetować licznika prób logowania',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };

    // Formatowanie daty
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('pl-PL');
    };

    if (loading) {
        return (
            <Container maxW="4xl" py={12} centerContent>
                <Spinner size="xl" />
            </Container>
        );
    }

    return (
        <Container maxW="4xl" py={8}>
            <Box mb={6}>
                <Button
                    leftIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/users')}
                    variant="outline"
                >
                    Powrót do listy użytkowników
                </Button>
            </Box>

            <Heading as="h1" size="xl" mb={6}>
                Szczegóły użytkownika {userData?.email}
            </Heading>

            {error && (
                <Alert status="error" mb={6} rounded="md">
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {success && (
                <Alert status="success" mb={6} rounded="md">
                    <AlertIcon />
                    {success}
                </Alert>
            )}

            {userData && (
                <Box
                    bg={bgColor}
                    rounded="xl"
                    boxShadow="lg"
                    p={6}
                >
                    <AdminUserStats
                        userData={userData}
                        formatDate={formatDate}
                        statBgColor={statBgColor}
                    />

                    <Divider mt={6} mb={6} />

                    {/* Dane konta */}
                    <Box>
                        <Heading size="md" mb={4}>Dane konta</Heading>
                        <AdminUserAccountForm
                            userData={userData}
                            handleChange={handleChange}
                            onSubmit={handleSubmit}
                            saving={saving}
                        />
                    </Box>

                    <Divider mt={6} mb={6} />

                    {/* Bezpieczeństwo konta */}
                    <Box>
                        <Heading size="md" mb={4}>Bezpieczeństwo konta</Heading>
                        <AdminUserSecurity
                            userData={userData}
                            toggleAccountStatus={toggleAccountStatus}
                            resetLoginAttempts={resetLoginAttempts}
                            formatDate={formatDate}
                        />
                    </Box>

                    <Divider mt={6} mb={6} />

                    {/* Dane profilu */}
                    <Box>
                        <Heading size="md" mb={4}>Profil użytkownika</Heading>
                        <AdminUserProfileForm
                            userData={userData}
                            handleChange={handleChange}
                            handleDateChange={handleDateChange}
                        />

                        {/* Przycisk zapisz dla profilu */}
                        <Flex justify="flex-end" gap={4} pt={4}>
                            <Button
                                colorScheme="blue"
                                onClick={handleSubmit}
                                isLoading={saving}
                            >
                                Zapisz profil
                            </Button>
                        </Flex>
                    </Box>
                    <Divider mt={6} mb={6} />
                    <Box>
                        <Heading size="md" mb={4}>Rekomendacje</Heading>
                        <AdminUserRecommendations userId={userId} />
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default AdminUserDetails;