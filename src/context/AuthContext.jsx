import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: !!localStorage.getItem('jwtToken'),
        email: localStorage.getItem('userEmail') || '',
        role: localStorage.getItem('userRole') || '',
        authProvider: localStorage.getItem('authProvider') || 'LOCAL'
    });

    const login = (token, email, role, provider) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        localStorage.setItem('authProvider', provider);
        setAuthState({ isLoggedIn: true, email, role, provider });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authProvider');
        setAuthState({ isLoggedIn: false, email: '', role: '', provider: '' });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);