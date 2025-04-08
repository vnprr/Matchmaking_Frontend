// src/components/Register.jsx
import { useState } from 'react';
import api from '../services/api';

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
        <div>
            <h2>Zarejestruj się</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Twój email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Twoje hasło"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Zarejestruj się</button>
            </form>

            <hr />

            <button onClick={handleGoogleLogin}>
                Zarejestruj się przez Google
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;