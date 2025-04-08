import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';

const ResendVerificationEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const email = location.state?.email;

    const handleResendVerificationEmail = async () => {
        try {
            await api.post('/api/auth/resend-verification-email', { email });
            setMessage('Email weryfikacyjny został wysłany ponownie. Sprawdź swoją skrzynkę pocztową.');
        } catch (err) {
            setError('Nie udało się wysłać emaila weryfikacyjnego. Spróbuj ponownie później.');
        }
    };

    return (
        <div>
            <h2>Zweryfikuj swoje konto</h2>
            <p>Twoje konto nie jest zweryfikowane. Sprawdź swoją skrzynkę pocztową, aby aktywować konto.</p>
            <button onClick={handleResendVerificationEmail}>
                Wyślij ponownie email weryfikacyjny
            </button>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <button onClick={() => navigate('/login')}>Powrót do logowania</button>
        </div>
    );
};

export default ResendVerificationEmail;