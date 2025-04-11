import {
    Button,
    FormControl,
    Input,
    Stack,
    Heading,
    Text,
    Container,
    useColorModeValue,
    Divider,
    FormErrorMessage,
    Alert,
    AlertIcon,
    Box
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../services/api';
import { FcGoogle } from 'react-icons/fc'

const Register = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);

    const validatePassword = (pass) => {
        if (pass.length < 8) {
            setPasswordError('Hasło musi mieć minimum 8 znaków');
            return false;
        }
        if (!/[A-Z]/.test(pass)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną wielką literę');
            return false;
        }
        if (!/[a-z]/.test(pass)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną małą literę');
            return false;
        }
        if (!/[0-9]/.test(pass)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną cyfrę');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) return;

        try {
            setIsSubmitting(true);
            setIsError(false);
            await api.post('/api/auth/register', { email, password });
            setMessage('Zarejestrowano pomyślnie! Sprawdź skrzynkę email, aby potwierdzić konto.');
            setEmail('');
            setPassword('');
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Błąd rejestracji! Spróbuj ponownie.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <Container maxW="md" py={12}>
            <Stack
                spacing={4}
                bg={useColorModeValue('white', 'gray.700')}
                rounded="xl"
                boxShadow="lg"
                p={6}
            >
                <Heading size="lg">Zarejestruj się</Heading>

                {message && (
                    <Alert status={isError ? "error" : "success"} rounded="md">
                        <AlertIcon />
                        {message}
                    </Alert>
                )}

                <form onSubmit={handleRegister}>
                    <Stack spacing={4}>
                        <FormControl id="email" isRequired>
                            <Input
                                type="email"
                                value={email}
                                placeholder="Twój email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>

                        <FormControl id="password" isRequired isInvalid={passwordError !== ''}>
                            <Input
                                type="password"
                                value={password}
                                placeholder="Twoje hasło"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę, jedną małą literę i jedną cyfrę.
                            </Text>
                            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={isSubmitting}
                        >
                            Zarejestruj się
                        </Button>
                    </Stack>
                </form>

                <Divider />

                <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    leftIcon={<FcGoogle />}
                    isDisabled={isSubmitting}
                >
                    Zarejestruj się przez Google
                </Button>
            </Stack>
        </Container>
    );
};

export default Register;