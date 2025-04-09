import {
    Button,
    FormControl,
    Input,
    Stack,
    Heading,
    Text,
    Container,
    useColorModeValue,
    Divider, Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../services/api';
import { FcGoogle } from 'react-icons/fc'

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/auth/register', { email, password });
            setMessage('Zarejestrowano pomyślnie! Sprawdź skrzynkę email, aby potwierdzić konto.');
            setEmail('');
            setPassword('');
        } catch (error) {
            setMessage('Błąd rejestracji! Spróbuj ponownie.');
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
                <form onSubmit={handleRegister}>
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
                            Zarejestruj się
                        </Button>
                    </Stack>
                </form>

                <Divider />

                <Button onClick={handleGoogleLogin} variant={'outline'} leftIcon={<FcGoogle />}>
                {/*<Button onClick={handleGoogleLogin} variant="outline">*/}
                    Zarejestruj się przez Google
                </Button>

                {message && (
                    <Text
                        color={message.includes('pomyślnie') ? 'green.500' : 'red.500'}
                    >
                        {message}
                    </Text>
                )}
            </Stack>
        </Container>
    );
};

export default Register;

// // src/components/Register.jsx
// import { useState } from 'react';
// import api from '../services/api';
//
// const Register = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [message, setMessage] = useState('');
//
//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             await api.post('/api/auth/register', { email, password });
//             setMessage('Zarejestrowano pomyślnie! Sprawdź skrzynkę email, aby potwierdzić konto.');
//             setEmail('');
//             setPassword('');
//         } catch (error) {
//             setMessage('Błąd rejestracji! Spróbuj ponownie.');
//         }
//     };
//
//     const handleGoogleLogin = () => {
//         window.location.href = 'http://localhost:8080/oauth2/authorization/google';
//     };
//
//     return (
//         <div>
//             <h2>Zarejestruj się</h2>
//
//             <form onSubmit={handleRegister}>
//                 <input
//                     type="email"
//                     placeholder="Twój email"
//                     value={email}
//                     required
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//
//                 <input
//                     type="password"
//                     placeholder="Twoje hasło"
//                     value={password}
//                     required
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//
//                 <button type="submit">Zarejestruj się</button>
//             </form>
//
//             <hr />
//
//             <button onClick={handleGoogleLogin}>
//                 Zarejestruj się przez Google
//             </button>
//
//             {message && <p>{message}</p>}
//         </div>
//     );
// };
//
// export default Register;