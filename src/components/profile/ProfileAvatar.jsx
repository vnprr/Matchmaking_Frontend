// src/components/profile/ProfileAvatar.jsx
import { useState, useEffect } from 'react';
import { Avatar, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserAvatar } from '../../services/galleryService';

const ProfileAvatar = ({ size = "md", ...props }) => {
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const { email } = useAuth();

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                setLoading(true);
                const avatarData = await fetchUserAvatar();
                setAvatar(avatarData);
            } catch (err) {
                console.error('Error fetching avatar:', err);
                setAvatar(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAvatar();
    }, []);

    if (loading) {
        return <Spinner size={size === "lg" ? "md" : "sm"} />;
    }

    return (
        <Avatar
            name={email || ""}
            src={avatar?.avatarUrl}
            size={size}
            border="2px solid"
            borderColor="gray.300"
            {...props}
        />
    );
};

export default ProfileAvatar;
