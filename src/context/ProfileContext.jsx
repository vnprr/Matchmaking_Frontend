// src/context/ProfileContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { userId: urlUserId } = useParams() || {};
    const [profileContext, setProfileContext] = useState({
        isEditable: false,
        isViewable: false,
        profileId: null,
        loading: true,
        error: null,
        personal: null,
    });

    const fetchProfileData = async () => {
        try {
            let userId = urlUserId || 'me';
            const contextResponse = await api.get(`/api/profile/context/${userId}`);
            const { userId: profileId, editable, viewable } = contextResponse.data;
            const personalResponse = await api.get(`/api/profile/${userId}`);
            const personal = personalResponse.data;
            setProfileContext({
                isEditable: editable,
                isViewable: viewable,
                profileId,
                loading: false,
                error: null,
                personal,
            });
        } catch (err) {
            setProfileContext({
                isEditable: false,
                isViewable: false,
                profileId: null,
                loading: false,
                error: `Błąd: ${err.message}`,
                personal: null,
            });
        }
    };

    useEffect(() => {
        fetchProfileData();
        // eslint-disable-next-line
    }, [urlUserId]);

    // Funkcja do aktualizacji danych personalnych
    const updatePersonal = async (newData) => {
        const userId = profileContext.profileId || 'me';
        // Usuń pola z null lub pustym stringiem
        const filteredData = Object.fromEntries(
            Object.entries(newData).filter(([_, v]) => v !== null && v !== '')
        );
        await api.put(`/api/profile/${userId}`, filteredData);
        await fetchProfileData();
    };

    return (
        <ProfileContext.Provider value={{ ...profileContext, updatePersonal }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => useContext(ProfileContext);