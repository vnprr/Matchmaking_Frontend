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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {FcGoogle} from "react-icons/fc";
import {HiHeart} from "react-icons/hi";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();  // Pobieramy funkcję login z kontekstu

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/auth/login', { email, password });

            // Wywołanie login z poprawnymi argumentami
            login(data.token, data.email, data.role);

            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                navigate('/verify-account', { state: { email } });
            } else {
                setError('Logowanie nieudane. Sprawdź email i hasło.');
            }
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
                <Heading size="lg">Zaloguj się</Heading>
                <form onSubmit={handleLogin}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <Input
                                type="email"
                                value={email}
                                placeholder="Twój email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl id="password">
                            <Input
                                type="password"
                                value={password}
                                placeholder="Twoje hasło"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue">
                            Zaloguj się
                        </Button>
                    </Stack>
                </form>

                <Divider />

                <Button onClick={handleGoogleLogin} variant="outline" leftIcon={<FcGoogle />}>
                    Zaloguj się przez Google
                </Button>

                {error && (
                    <Text color="red.500">{error}</Text>
                )}
            </Stack>
        </Container>
    );
};

export default Login;