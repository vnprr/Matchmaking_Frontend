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