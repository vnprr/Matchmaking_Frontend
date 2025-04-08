// import { createContext, useContext, useState, useEffect } from 'react';
//
// const AuthContext = createContext();
//
// export const AuthProvider = ({ children }) => {
//     const [authState, setAuthState] = useState({
//         isLoggedIn: !!localStorage.getItem('jwtToken'),
//         token: localStorage.getItem('jwtToken') || '',
//         email: localStorage.getItem('userEmail') || '',
//         role: localStorage.getItem('userRole') || ''
//     });
//
//     const login = (token, email, role) => {
//         localStorage.setItem('jwtToken', token);
//         localStorage.setItem('userEmail', email);
//         localStorage.setItem('userRole', role);
//         setAuthState({ isLoggedIn: true, token, email, role });
//     };
//
//     const logout = () => {
//         localStorage.removeItem('jwtToken');
//         localStorage.removeItem('userEmail');
//         localStorage.removeItem('userRole');
//         setAuthState({ isLoggedIn: false, token: '', email: '', role: '' });
//     };
//
//     useEffect(() => {
//         const token = localStorage.getItem('jwtToken');
//         if (!token) {
//             setAuthState({ isLoggedIn: false, token: '', email: '', role: '' });
//         }
//     }, []);
//
//     return (
//         <AuthContext.Provider value={{ ...authState, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => useContext(AuthContext);
//


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';
//
// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const { login } = useAuth();
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await api.post('/api/auth/login', { email, password });
//             login(data.token, data.email, data.role);
//             navigate('/');
//         } catch (err) {
//             if (err.response && err.response.status === 403) {
//                 navigate('/verify-account', { state: { email } });
//             } else {
//                 setError('Login failed. Check your email and password.');
//             }
//         }
//     };
//
//     const handleGoogleLogin = () => {
//         window.location.href = 'http://localhost:8080/oauth2/authorization/google';
//     };
//
//     return (
//         <div>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <input
//                     type="email"
//                     value={email}
//                     placeholder="Your email"
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     value={password}
//                     placeholder="Your password"
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Login</button>
//             </form>
//
//             <hr />
//
//             <button onClick={handleGoogleLogin}>
//                 Login with Google
//             </button>
//
//             {error && <p>{error}</p>}
//         </div>
//     );
// };
//
// export default Login;

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: !!localStorage.getItem('jwtToken'),
        email: localStorage.getItem('userEmail') || '',
        role: localStorage.getItem('userRole') || ''
    });

    const login = (token, email, role) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        setAuthState({ isLoggedIn: true, email, role });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        setAuthState({ isLoggedIn: false, email: '', role: '' });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);