import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const useLogout = () => {
    const navigate = useNavigate();
    const { logout: authLogout } = useAuth();

    return () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');

        authLogout();

        navigate('/login');
    };
};

export default useLogout;
