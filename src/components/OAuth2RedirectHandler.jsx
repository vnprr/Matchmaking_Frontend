// src/components/OAuth2RedirectHandler.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function decodeJwtToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Błąd dekodowania tokenu JWT:', error);
        return null;
    }
}

function OAuth2RedirectHandler() {
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const handleAuth = async () => {
            console.log('Parametry OAuth:', location.search);
            const params = new URLSearchParams(location.search);
            const token = params.get('token') || params.get('jwtToken') || params.get('access_token');

            if (token) {
                try {
                    const decodedToken = decodeJwtToken(token);

                    if (decodedToken) {
                        const email = decodedToken.sub || decodedToken.email || '';
                        let role = decodedToken.role || decodedToken.authorities || params.get('role') || 'USER';

                        // Obsługa różnych formatów roli
                        if (Array.isArray(role)) {
                            role = role[0];
                        } else if (typeof role === 'object' && role !== null) {
                            role = Object.values(role)[0] || 'USER';
                        }

                        console.log('Zapisuję dane logowania:', { email, role });

                        // Ważne: najpierw zapisz token w localStorage
                        localStorage.setItem('jwtToken', token);
                        localStorage.setItem('userEmail', email);
                        localStorage.setItem('userRole', role);
                        localStorage.setItem('authProvider', 'GOOGLE');

                        // Dopiero potem aktualizuj kontekst
                        login(token, email, role, 'GOOGLE');

                        // Przekieruj bezpośrednio do dashboard, nie do strony głównej
                        window.location.href = '/dashboard';
                    } else {
                        window.location.href = '/login?error=invalid_token';
                    }
                } catch (error) {
                    window.location.href = '/login?error=token_processing';
                }
            } else {
                window.location.href = '/login?error=oauth2';
            }
        };

        handleAuth();
    }, [location, login]);

    return <p>Trwa logowanie przez Google...</p>;
}

export default OAuth2RedirectHandler;
