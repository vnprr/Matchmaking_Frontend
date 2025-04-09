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

                        // Dopiero potem aktualizuj kontekst
                        login(token, email, role);

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

// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
//
// // Funkcja dekodująca token JWT
// function decodeJwtToken(token) {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split('')
//                 .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//                 .join('')
//         );
//         return JSON.parse(jsonPayload);
//     } catch (error) {
//         console.error('Error decoding JWT token:', error);
//         return null;
//     }
// }
//
// function OAuth2RedirectHandler() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { login } = useAuth();
//
//     useEffect(() => {
//         console.log('OAuth callback params:', location.search);
//         const params = new URLSearchParams(location.search);
//         const token = params.get('token') || params.get('jwtToken') || params.get('access_token');
//
//         console.log('Token received:', token);
//
//         if (token) {
//             try {
//                 // Dekoduj token JWT, aby uzyskać dane użytkownika
//                 const decodedToken = decodeJwtToken(token);
//                 console.log('Decoded token:', decodedToken);
//
//                 if (decodedToken) {
//                     // Email w JWT zwykle jest w polu 'sub'
//                     const email = decodedToken.sub || '';
//                     const role = decodedToken.role || params.get('role') || 'USER';
//
//                     console.log('Logging in with decoded email:', email);
//                     login(token, email, role);
//                     navigate('/');
//                 } else {
//                     console.log('Could not decode token');
//                     navigate('/login?error=invalid_token');
//                 }
//             } catch (error) {
//                 console.error('Error processing token:', error);
//                 navigate('/login?error=token_processing');
//             }
//         } else {
//             console.log('No token found in URL');
//             navigate('/login?error=oauth2');
//         }
//     }, [location, login, navigate]);
//
//     return <p>Trwa logowanie przez Google...</p>;
// }
//
// export default OAuth2RedirectHandler;
//
// // import { useEffect } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// //
// // function OAuth2RedirectHandler() {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     const { login } = useAuth();
// //
// //     useEffect(() => {
// //         const params = new URLSearchParams(location.search);
// //         // Pobieramy parametr 'token' z URL (tak przekazuje backend)
// //         const token = params.get('token');
// //         const email = params.get('email');
// //         const role = params.get('role') || 'USER';
// //
// //         if (token && email) {
// //             // Funkcja login z kontekstu Aduth zapisze token jako 'jwtToken' w localStorage
// //             login(token, email, role);
// //             navigate('/');
// //         } else {
// //             navigate('/login?error=oauth2');
// //         }
// //     }, [location, login, navigate]);
// //
// //     return <p>Trwa logowanie przez Google...</p>;
// // }
// //
// // export default OAuth2RedirectHandler;
// //
// // // import { useEffect } from 'react';
// // // import { useNavigate, useLocation } from 'react-router-dom';
// // // import axios from '../services/api';
// // //
// // // function OAuth2RedirectHandler() {
// // //     const navigate = useNavigate();
// // //     const location = useLocation();
// // //
// // //     useEffect(() => {
// // //         const params = new URLSearchParams(location.search);
// // //         const token = params.get('jwtToken');
// // //
// // //         if (token) {
// // //             localStorage.setItem('jwtToken', token);
// // //             fetchProfileAndRedirect();
// // //         } else {
// // //             navigate('/login?error=oauth2');
// // //         }
// // //     }, []);
// // //
// // //     const fetchProfileAndRedirect = async () => {
// // //         try {
// // //             const res = await axios.get('/api/profile');
// // //
// // //             const profile = res.data;
// // //             const completed = Boolean(profile.firstName && profile.lastName);
// // //             localStorage.setItem('profileCompleted', completed ? 'true' : 'false');
// // //
// // //             navigate(completed ? '/profile' : '/complete-profile');
// // //         } catch (err) {
// // //             console.error("Cannot fetch profile after OAuth2 login", err);
// // //             navigate('/login');
// // //         }
// // //     };
// // //
// // //     return <p>Trwa logowanie przez Google...</p>;
// // // }
// // //
// // // export default OAuth2RedirectHandler;