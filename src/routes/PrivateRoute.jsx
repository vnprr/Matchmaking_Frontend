// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { isLoggedIn } = useAuth();

    console.log('PrivateRoute sprawdzanie:', { isLoggedIn, token: localStorage.getItem('jwtToken') });

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

// // src/routes/PrivateRoute.jsx
// import { Navigate, Outlet } from 'react-router-dom';
//
// const PrivateRoute = () => {
//     const token = localStorage.getItem('jwtToken');
//     return token ? <Outlet /> : <Navigate to="/login" replace />;
// };
//
// export default PrivateRoute;