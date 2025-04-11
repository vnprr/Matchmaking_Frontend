// src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import api from '../services/api';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (!tokenParam) {
            setIsError(true);
            setMessage('Nieprawidłowy link resetowania hasła. Spróbuj ponownie.');
        } else {
            setToken(tokenParam);
        }
    }, [location]);

    const validatePassword = () => {
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
        if (password !== passwordConfirm) {
            setPasswordError('Hasła nie są identyczne');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        try {
            setLoading(true);
            setIsError(false);
            await api.post('/api/auth/reset-password', { token, newPassword: password });
            setMessage('Hasło zostało zmienione. Za chwilę nastąpi przekierowanie do strony logowania.');

            // Przekierowanie po udanej zmianie hasła
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                'Wystąpił błąd podczas resetowania hasła. Link mógł wygasnąć lub jest nieprawidłowy.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="md" py={12}>
            <Box
                bg={useColorModeValue('white', 'gray.700')}
                p={8}
                rounded="xl"
                boxShadow="lg"
            >
                <Heading size="lg" mb={6}>Ustaw nowe hasło</Heading>

                {message && (
                    <Alert status={isError ? "error" : "success"} mb={6} rounded="md">
                        <AlertIcon />
                        {message}
                    </Alert>
                )}

                {token && (
                    <form onSubmit={handleSubmit}>
                        <FormControl id="password" isRequired mb={4} isInvalid={passwordError !== ''}>
                            <FormLabel>Nowe hasło</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 8 znaków"
                            />
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę, jedną małą literę i jedną cyfrę.
                            </Text>
                            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                        </FormControl>

                        <FormControl id="passwordConfirm" isRequired mb={6}>
                            <FormLabel>Potwierdź hasło</FormLabel>
                            <Input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Powtórz hasło"
                            />
                        </FormControl>

                        <Button
                            colorScheme="blue"
                            type="submit"
                            isLoading={loading}
                            w="full"
                        >
                            Zmień hasło
                        </Button>
                    </form>
                )}
            </Box>
        </Container>
    );
};

export default ResetPasswordPage;