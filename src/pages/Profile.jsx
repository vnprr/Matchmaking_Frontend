// src/components/Profile.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await api.get('/api/user/me');
            setUser(data);
        };
        fetchUser();
    }, []);

    return (
        <div>
            <h2>Twój profil:</h2>
            {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : 'Ładowanie...'}
        </div>
    );
};

export default Profile;