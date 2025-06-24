import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useLocation } from 'react-router-dom';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { profileId: urlProfileId } = useParams() || {};
    const location = useLocation();
    const [profileContext, setProfileContext] = useState({
        isEditable: false,
        isViewable: false,
        profileId: null,
        isOwner: false,
        loading: true,
        error: null,
        personal: null,
    });

    const fetchProfileData = async () => {
        try {
            const profileIdParam = urlProfileId || 'me';
            const contextResponse = await api.get(`/api/profile/context/${profileIdParam}`);
            const { editable, viewable, owner: isOwner } = contextResponse.data;

            const personalResponse = await api.get(`/api/profile/${profileIdParam}`);

            setProfileContext({
                isEditable: editable,
                isViewable: viewable,
                profileId: profileIdParam === 'me' ? contextResponse.data.profileId : profileIdParam,
                isOwner,
                loading: false,
                error: null,
                personal: personalResponse.data,
            });
        } catch (err) {
            setProfileContext({
                isEditable: false,
                isViewable: false,
                profileId: null,
                isOwner: false,
                loading: false,
                error: `Błąd: ${err.message}`,
                personal: null,
            });
        }
    };

    useEffect(() => {
        setProfileContext(prev => ({ ...prev, loading: true }));
        fetchProfileData();
    }, [urlProfileId, location.pathname]);

    const updatePersonal = async (newData) => {
        const profileIdToUpdate = urlProfileId || profileContext.profileId;
        if (!profileIdToUpdate) throw new Error("Brak identyfikatora profilu");

        const filteredData = Object.fromEntries(
            Object.entries(newData).filter(([, value]) => value !== null && value !== '')
        );

        await api.put(`/api/profile/${profileIdToUpdate}`, filteredData);
        await fetchProfileData();
    };

    return (
        <ProfileContext.Provider value={{ ...profileContext, updatePersonal }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => useContext(ProfileContext);
