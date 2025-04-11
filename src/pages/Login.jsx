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
    Link,
    FormErrorMessage,
    Box
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = () => {
        if (error) setError('');
    };

    const handleLogin = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            login(data.token, data.email, data.role);
            navigate('/');
        } catch (err) {
            console.log('Błąd logowania:', err);

            if (err.response && err.response.status === 403) {
                const errorMessage = err.response.data;

                if (errorMessage.includes('verify') || errorMessage.includes('potwierdź')) {
                    navigate('/verify-account', { state: { email } });
                    return;
                }

                if (errorMessage.includes('Konto zablokowane') || errorMessage.includes('limit nieudanych prób')) {
                    setError(errorMessage);
                } else {
                    setError('Błąd logowania: ' + errorMessage);
                }
            } else {
                setError('Logowanie nieudane. Sprawdź email i hasło.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
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
                <Heading size="lg">Zaloguj się</Heading>

                <Box>
                    <Stack spacing={4}>
                        <FormControl id="email" isInvalid={error !== ''}>
                            <Input
                                type="email"
                                value={email}
                                placeholder="Twój email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleChange();
                                }}
                                onKeyPress={handleKeyPress}
                                required
                            />
                        </FormControl>

                        <FormControl id="password" isInvalid={error !== ''}>
                            <Input
                                type="password"
                                value={password}
                                placeholder="Twoje hasło"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    handleChange();
                                }}
                                onKeyPress={handleKeyPress}
                                required
                            />
                            {error && (
                                <FormErrorMessage>{error}</FormErrorMessage>
                            )}
                        </FormControl>
                        <Text align="right" mt={1} fontSize="xs" color="gray.500">
                            <Link as={RouterLink} to="/forgot-password">
                                Zapomniałeś hasła?
                            </Link>
                        </Text>
                        <Button
                            onClick={handleLogin}
                            colorScheme="blue"
                            isLoading={isSubmitting}
                            loadingText="Logowanie..."
                        >
                            Zaloguj się
                        </Button>

                    </Stack>
                </Box>

                <Divider />

                <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    leftIcon={<FcGoogle />}
                    isDisabled={isSubmitting}
                >
                    Zaloguj się przez Google
                </Button>
            </Stack>
        </Container>
    );
};

export default Login;