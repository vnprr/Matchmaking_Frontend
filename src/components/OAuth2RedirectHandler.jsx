// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from '../services/api';
//
// function OAuth2RedirectHandler() {
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const token = params.get('token');
//
//         if (token) {
//             localStorage.setItem('token', token);
//             fetchProfileAndRedirect();
//         } else {
//             navigate('/login?error=oauth2');
//         }
//     }, []);
//
//     const fetchProfileAndRedirect = async () => {
//         try {
//             const res = await axios.get('/api/profile');
//
//             const profile = res.data;
//             const completed = Boolean(profile.firstName && profile.lastName);
//             localStorage.setItem('profileCompleted', completed ? 'true' : 'false');
//
//             navigate(completed ? '/profile' : '/complete-profile');
//         } catch (err) {
//             console.error("Cannot fetch profile after OAuth2 login", err);
//             navigate('/login');
//         }
//     };
//
//     return <p>Trwa logowanie przez Google...</p>;
// }
//
// export default OAuth2RedirectHandler;