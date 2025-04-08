import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useLogout from './Logout';

const Navbar = () => {
    const { isLoggedIn, email } = useAuth();
    const logout = useLogout();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            marginBottom: '1rem'
        }}>
            <div className="logo">
                <Link to="/">Strona główna</Link>
            </div>

            <div className="menu" style={{ display: 'flex', gap: '1rem' }}>
                {isLoggedIn ? (
                    <>
                        <span>Witaj, {email}</span>
                        <Link to="/profile">Profil</Link>
                        <button onClick={logout}>Wyloguj</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Logowanie</Link>
                        <Link to="/register">Rejestracja</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;