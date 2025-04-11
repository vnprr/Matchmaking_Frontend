// src/routes/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { isLoggedIn, role } = useAuth();

    // Przekierowanie jeśli użytkownik nie jest zalogowany lub nie ma roli ADMIN
    return isLoggedIn && role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;