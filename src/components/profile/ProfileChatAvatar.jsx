// src/components/profile/ProfileChatAvatar.jsx
import { useState, useEffect } from 'react';
import { Avatar, Spinner } from '@chakra-ui/react';
import { fetchProfileAvatar } from '../../services/galleryService';

const ProfileChatAvatar = ({ profileId, size = "sm", name = "", ...props }) => {
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!profileId) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const avatarData = await fetchProfileAvatar(profileId);
                setAvatar(avatarData);
            } catch (err) {
                console.error(`Error fetching avatar for profile ${profileId}:`, err);
                setAvatar(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAvatar();
    }, [profileId]);

    if (loading) {
        return <Spinner size={size === "lg" ? "md" : "sm"} />;
    }

    return (
        <Avatar
            name={name}
            src={avatar?.avatarUrl}
            size={size}
            border="2px solid"
            borderColor="gray.300"
            {...props}
        />
    );
};

export default ProfileChatAvatar;