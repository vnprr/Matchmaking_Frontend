// src/components/profile/ProfileAvatar.jsx
import { useState, useEffect } from 'react';
import { Avatar, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfileAvatar = ({ size = "md", ...props }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { email } = useAuth();

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/profile/images/main');
                setProfileImage(response.data?.imageUrl || null);
            } catch (err) {
                console.error('Błąd pobierania zdjęcia profilowego:', err);
                setProfileImage(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileImage();
    }, []);

    if (loading) {
        return <Spinner size={size === "lg" ? "md" : "sm"} />;
    }

    return (
        <Avatar
            name={email || ""}
            src={profileImage}
            size={size}
            {...props}
        />
    );
};

export default ProfileAvatar;