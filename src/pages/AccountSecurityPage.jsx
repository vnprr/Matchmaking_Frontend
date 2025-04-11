// src/pages/AccountSecurityPage.jsx
import { useState } from 'react';
import {
    Container,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    Alert,
    AlertIcon,
    FormErrorMessage,
    useColorModeValue,
    Stack,
    Collapse,
    Divider,
    useDisclosure,
    Icon
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, LockIcon, EmailIcon } from '@chakra-ui/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AccountSecurityPage = () => {
    const { email: currentEmail, role } = useAuth();

    // Stan dla formularza zmiany hasła
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Stan dla formularza zmiany email
    const [passwordForEmail, setPasswordForEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // Stan dla komunikatów
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Controls dla rozwijanych paneli
    const passwordSection = useDisclosure();
    const emailSection = useDisclosure();

    // Sprawdzenie czy użytkownik korzysta z OAuth2
    const { authProvider } = useAuth();
    const isOAuthUser = authProvider === 'GOOGLE';

    const bgColor = useColorModeValue('white', 'gray.700');

    const validatePassword = () => {
        if (newPassword.length < 8) {
            setPasswordError('Hasło musi mieć minimum 8 znaków');
            return false;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną wielką literę');
            return false;
        }
        if (!/[a-z]/.test(newPassword)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną małą literę');
            return false;
        }
        if (!/[0-9]/.test(newPassword)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną cyfrę');
            return false;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Hasła nie są identyczne');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (isOAuthUser) {
            setIsError(true);
            setMessage('Użytkownicy zalogowani przez Google nie mogą zmienić hasła.');
            return;
        }

        if (!validatePassword()) return;

        try {
            setLoading(true);
            setIsError(false);

            await api.post('/api/auth/change-password', {
                currentPassword,
                newPassword,
                confirmNewPassword
            });

            setMessage('Hasło zostało zmienione pomyślnie.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            passwordSection.onClose();

        } catch (error) {
            setIsError(true);
            if (error.response?.status === 401) {
                setMessage('Aktualne hasło jest nieprawidłowe.');
            } else if (error.response?.status === 403) {
                setMessage('Nie możesz zmienić hasła dla konta Google.');
            } else {
                setMessage(error.response?.data?.message || 'Wystąpił błąd podczas zmiany hasła.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();

        if (isOAuthUser) {
            setIsError(true);
            setMessage('Użytkownicy zalogowani przez Google nie mogą zmienić adresu email.');
            return;
        }

        if (newEmail === currentEmail) {
            setIsError(true);
            setMessage('Nowy adres email jest taki sam jak obecny.');
            return;
        }

        try {
            setLoading(true);
            setIsError(false);

            await api.post('/api/auth/change-email', {
                password: passwordForEmail,
                newEmail
            });

            setMessage('Adres email zostanie zmieniony po potwierdzeniu. Sprawdź oba adresy email.');
            setPasswordForEmail('');
            setNewEmail('');
            emailSection.onClose();

        } catch (error) {
            setIsError(true);
            if (error.response?.status === 401) {
                setMessage('Podane hasło jest nieprawidłowe.');
            } else if (error.response?.status === 403) {
                setMessage('Nie możesz zmienić adresu email dla konta Google.');
            } else if (error.response?.status === 400 && error.response?.data?.includes('email już istnieje')) {
                setMessage('Podany adres email jest już używany przez inne konto.');
            } else {
                setMessage(error.response?.data?.message || 'Wystąpił błąd podczas zmiany adresu email.');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordSection = () => {
        passwordSection.onToggle();
        if (emailSection.isOpen) emailSection.onClose();
        setMessage('');
    };

    const toggleEmailSection = () => {
        emailSection.onToggle();
        if (passwordSection.isOpen) passwordSection.onClose();
        setMessage('');
    };

    return (
        <Container maxW="md" py={12}>
            <Box
                bg={bgColor}
                p={8}
                rounded="xl"
                boxShadow="lg"
            >
                <Heading size="lg" mb={6}>Bezpieczeństwo konta</Heading>

                {message && (
                    <Alert status={isError ? "error" : "success"} mb={6} rounded="md">
                        <AlertIcon />
                        {message}
                    </Alert>
                )}

                {isOAuthUser && (
                    <Alert status="info" mb={6} rounded="md">
                        <AlertIcon />
                        Konto Google: opcje zmiany hasła i adresu email są niedostępne.
                    </Alert>
                )}

                <Stack spacing={5}>
                    {/* Informacje o koncie */}
                    <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.500">Adres email:</Text>
                        <Text fontSize="lg">{currentEmail}</Text>

                        <Text fontWeight="bold" fontSize="sm" color="gray.500" mt={2}>Typ konta:</Text>
                        <Text fontSize="lg">{isOAuthUser ? 'Google' : 'Lokalne'}</Text>
                    </Box>

                    <Divider />

                    {/* Sekcja zmiany hasła */}
                    <Box>
                        <Button
                            onClick={togglePasswordSection}
                            variant="ghost"
                            rightIcon={passwordSection.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            leftIcon={<LockIcon />}
                            justifyContent="space-between"
                            width="100%"
                            isDisabled={isOAuthUser}
                        >
                            Zmień hasło
                        </Button>

                        <Collapse in={passwordSection.isOpen} animateOpacity>
                            <Box p={4} mt={2} bg={useColorModeValue('gray.50', 'gray.600')} rounded="md">
                                <form onSubmit={handlePasswordChange}>
                                    <Stack spacing={3}>
                                        <FormControl id="currentPassword" isRequired>
                                            <FormLabel>Aktualne hasło</FormLabel>
                                            <Input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Podaj aktualne hasło"
                                            />
                                        </FormControl>

                                        <FormControl id="newPassword" isRequired isInvalid={passwordError !== ''}>
                                            <FormLabel>Nowe hasło</FormLabel>
                                            <Input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Podaj nowe hasło"
                                            />
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                Hasło musi zawierać minimum 8 znaków, wielką literę, małą literę i cyfrę.
                                            </Text>
                                            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                                        </FormControl>

                                        <FormControl id="confirmNewPassword" isRequired>
                                            <FormLabel>Potwierdź nowe hasło</FormLabel>
                                            <Input
                                                type="password"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                placeholder="Potwierdź nowe hasło"
                                            />
                                        </FormControl>

                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            isLoading={loading}
                                        >
                                            Zmień hasło
                                        </Button>
                                    </Stack>
                                </form>
                            </Box>
                        </Collapse>
                    </Box>

                    {/* Sekcja zmiany emaila */}
                    <Box>
                        <Button
                            onClick={toggleEmailSection}
                            variant="ghost"
                            rightIcon={emailSection.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            leftIcon={<EmailIcon />}
                            justifyContent="space-between"
                            width="100%"
                            isDisabled={isOAuthUser}
                        >
                            Zmień adres email
                        </Button>

                        <Collapse in={emailSection.isOpen} animateOpacity>
                            <Box p={4} mt={2} bg={useColorModeValue('gray.50', 'gray.600')} rounded="md">
                                <form onSubmit={handleEmailChange}>
                                    <Stack spacing={3}>
                                        <FormControl id="currentEmail">
                                            <FormLabel>Obecny adres email</FormLabel>
                                            <Input
                                                type="email"
                                                value={currentEmail}
                                                isReadOnly
                                                bg="gray.100"
                                            />
                                        </FormControl>

                                        <FormControl id="newEmail" isRequired>
                                            <FormLabel>Nowy adres email</FormLabel>
                                            <Input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder="Podaj nowy adres email"
                                            />
                                        </FormControl>

                                        <FormControl id="passwordForEmail" isRequired>
                                            <FormLabel>Hasło</FormLabel>
                                            <Input
                                                type="password"
                                                value={passwordForEmail}
                                                onChange={(e) => setPasswordForEmail(e.target.value)}
                                                placeholder="Podaj swoje hasło"
                                            />
                                        </FormControl>

                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            isLoading={loading}
                                        >
                                            Zmień adres email
                                        </Button>
                                    </Stack>
                                </form>
                            </Box>
                        </Collapse>
                    </Box>
                </Stack>
            </Box>
        </Container>
    );
};

export default AccountSecurityPage;