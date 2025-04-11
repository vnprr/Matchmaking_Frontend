// src/pages/admin/AdminUserDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    Container,
    Box,
    Heading,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Divider,
    useColorModeValue,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    Alert,
    AlertIcon,
    useToast,
    Spinner,
    Switch,
    FormErrorMessage,
    Textarea,
    IconButton,
    ButtonGroup,
    HStack
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const AdminUserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Stan dla nowego hasła
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

    // Walidacja hasła
    const validatePassword = (password) => {
        if (!password) return true; // Puste hasło jest ok (nie zmieniamy)

        if (password.length < 8) {
            setPasswordError('Hasło musi mieć minimum 8 znaków');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną wielką literę');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną małą literę');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną cyfrę');
            return false;
        }

        setPasswordError('');
        return true;
    };

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
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Walidacja hasła, jeśli zostało podane
        if (newPassword && !validatePassword(newPassword)) {
            return;
        }

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
            setNewPassword('');

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
                    as="form"
                    onSubmit={handleSubmit}
                    bg={bgColor}
                    rounded="xl"
                    boxShadow="lg"
                    p={6}
                >
                    <Stack spacing={6}>
                        {/* Statystyki konta */}
                        <Box p={4} bg={statBgColor} rounded="md">
                            <Flex wrap="wrap" gap={16} justify="space-between">
                                <Stat>
                                    <StatLabel>ID użytkownika</StatLabel>
                                    <StatNumber>{userData.id}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Data utworzenia</StatLabel>
                                    <StatNumber fontSize="md">{formatDate(userData.createdAt)}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Ostatnia aktualizacja</StatLabel>
                                    <StatNumber fontSize="md">{formatDate(userData.updatedAt)}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Dostawca</StatLabel>
                                    <StatNumber fontSize="md">{userData.provider}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Status</StatLabel>
                                    <Badge
                                        colorScheme={userData.enabled ? 'green' : 'red'}
                                        fontSize="md"
                                        py={1}
                                        px={2}
                                    >
                                        {userData.enabled ? 'Aktywny' : 'Zablokowany'}
                                    </Badge>
                                </Stat>
                            </Flex>
                        </Box>

                        {/* Podstawowe dane konta */}
                        <Box>
                            <Heading size="md" mb={4}>Dane konta</Heading>

                            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                    />
                                </FormControl>


                            </Stack>

                            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                                <FormControl isInvalid={!!passwordError}>
                                    <FormLabel>Nowe hasło</FormLabel>
                                    <Input
                                        type="password"
                                        placeholder="Pozostaw puste, aby nie zmieniać"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Text fontSize="xs" color="gray.500">
                                        Min. 8 znaków, wielka i mała litera, cyfra
                                    </Text>
                                    {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Rola</FormLabel>
                                    <Select
                                        name="role"
                                        value={userData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Bezpieczeństwo konta */}
                        <Box>
                            <Heading size="md" mb={4}>Bezpieczeństwo konta</Heading>

                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                justify="space-between"
                                align="center"
                                gap={4}
                                mb={4}
                            >
                                <Box>
                                    <Text fontWeight="bold">Status konta</Text>
                                    <FormControl display="flex" alignItems="center">
                                        <Switch
                                            id="account-status"
                                            isChecked={userData.enabled}
                                            onChange={toggleAccountStatus}
                                            colorScheme="green"
                                        />
                                        <FormLabel htmlFor="account-status" mb="0" ml={2}>
                                            {userData.enabled ? 'Aktywne' : 'Zablokowane'}
                                        </FormLabel>
                                    </FormControl>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold">Nieudane próby logowania</Text>
                                    <HStack>
                                        <Badge colorScheme="red" fontSize="md">{userData.failedLoginAttempts}</Badge>
                                        <Button size="sm" onClick={resetLoginAttempts}>
                                            Resetuj
                                        </Button>
                                    </HStack>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold">Blokada do</Text>
                                    <Text>{userData.accountLockedUntil ? formatDate(userData.accountLockedUntil) : 'Brak'}</Text>
                                </Box>
                            </Flex>
                        </Box>

                        <Divider />

                        {/* Dane profilu */}
                        <Box>
                            <Heading size="md" mb={4}>Profil użytkownika</Heading>

                            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                                <FormControl>
                                    <FormLabel>Imię</FormLabel>
                                    <Input
                                        name="firstName"
                                        value={userData.firstName || ''}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Nazwisko</FormLabel>
                                    <Input
                                        name="lastName"
                                        value={userData.lastName || ''}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Stack>

                            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                                <FormControl>
                                    <FormLabel>Płeć</FormLabel>
                                    <Select
                                        name="gender"
                                        value={userData.gender || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Wybierz --</option>
                                        <option value="MALE">Mężczyzna</option>
                                        <option value="FEMALE">Kobieta</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Data urodzenia</FormLabel>
                                    <Input
                                        type="date"
                                        value={userData.dateOfBirth || ''}
                                        onChange={handleDateChange}
                                    />
                                </FormControl>
                            </Stack>

                            <FormControl mb={4}>
                                <FormLabel>Bio</FormLabel>
                                <Textarea
                                    name="bio"
                                    value={userData.bio || ''}
                                    onChange={handleChange}
                                    rows={5}
                                />
                            </FormControl>
                        </Box>

                        {/* Przyciski akcji */}
                        <Flex justify="flex-end" gap={4} pt={2}>
                            <Button
                                colorScheme="blue"
                                type="submit"
                                isLoading={saving}
                            >
                                Zapisz zmiany
                            </Button>
                        </Flex>
                    </Stack>
                </Box>
            )}
        </Container>
    );
};

export default AdminUserDetails;