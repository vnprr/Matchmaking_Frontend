// src/pages/ForgotPasswordPage.jsx
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
    useColorModeValue,
} from '@chakra-ui/react';
import api from '../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setLoading(true);
            setIsError(false);
            await api.post('/api/auth/forgot-password', { email });
            setMessage('Instrukcja resetowania hasła została wysłana na podany adres email.');
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie później.');
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
                <Heading size="lg" mb={6}>Resetowanie hasła</Heading>

                {message && (
                    <Alert status={isError ? "error" : "success"} mb={6} rounded="md">
                        <AlertIcon />
                        {message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <FormControl id="email" isRequired mb={4}>
                        <FormLabel>Adres email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Podaj swój adres email"
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        type="submit"
                        isLoading={loading}
                        w="full"
                    >
                        Wyślij instrukcję
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ForgotPasswordPage;