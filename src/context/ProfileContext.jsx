// src/context/ProfileContext.jsx
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
            // Pobieramy kontekst profilu używając profileId z URL
            let profileIdParam = urlProfileId || 'me';

            // Pobieramy kontekst używając ID z URL
            const contextResponse = await api.get(`/api/profile/context/${profileIdParam}`);
            const { editable, viewable, owner: isOwner } = contextResponse.data;

            // Używamy profileIdParam również do pobrania danych profilu
            const personalResponse = await api.get(`/api/profile/${profileIdParam}`);
            const personal = personalResponse.data;

            // Zapisujemy profileIdParam jako profileId w stanie
            setProfileContext({
                isEditable: editable,
                isViewable: viewable,
                profileId: profileIdParam === 'me' ? contextResponse.data.profileId : profileIdParam,
                isOwner,
                loading: false,
                error: null,
                personal,
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

    // Reset stanu i pobierz nowe dane przy zmianie URL
    useEffect(() => {
        setProfileContext(prev => ({
            ...prev,
            loading: true
        }));
        fetchProfileData();
    }, [urlProfileId, location.pathname]);

    // Funkcja do aktualizacji danych personalnych
    const updatePersonal = async (newData) => {
        const profileIdToUpdate = urlProfileId || profileContext.profileId;
        if (!profileIdToUpdate) {
            throw new Error("Brak identyfikatora profilu");
        }

        // Usuń pola z null lub pustym stringiem
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


// // src/context/ProfileContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';
// import { useParams } from 'react-router-dom';
//
// const ProfileContext = createContext();
//
// export const ProfileProvider = ({ children }) => {
//     const { profileId: urlProfileId } = useParams() || {};
//     const [profileContext, setProfileContext] = useState({
//         isEditable: false,
//         isViewable: false,
//         profileId: null,
//         userId: null,
//         isOwner: false,
//         loading: true,
//         error: null,
//         personal: null,
//     });
//
//     const fetchProfileData = async () => {
//         try {
//             // Pobieramy kontekst profilu używając profileId z URL lub domyślnego
//             let profileIdParam = urlProfileId || 'me';
//             const contextResponse = await api.get(`/api/profile/context/${profileIdParam}`);
//             const { profileId, userId, editable, viewable, owner: isOwner } = contextResponse.data;
//
//             // Pobieramy dane profilu używając profileId
//             const personalResponse = await api.get(`/api/profile/${profileId}`);
//             const personal = personalResponse.data;
//
//             setProfileContext({
//                 isEditable: editable,
//                 isViewable: viewable,
//                 profileId,
//                 userId,
//                 isOwner,
//                 loading: false,
//                 error: null,
//                 personal,
//             });
//         } catch (err) {
//             setProfileContext({
//                 isEditable: false,
//                 isViewable: false,
//                 profileId: null,
//                 userId: null,
//                 isOwner: false,
//                 loading: false,
//                 error: `Błąd: ${err.message}`,
//                 personal: null,
//             });
//         }
//     };
//
//     useEffect(() => {
//         fetchProfileData();
//         // eslint-disable-next-line
//     }, [urlProfileId]);
//
//     // Funkcja do aktualizacji danych personalnych
//     const updatePersonal = async (newData) => {
//         const profileIdToUpdate = profileContext.profileId;
//         if (!profileIdToUpdate) {
//             throw new Error("Brak identyfikatora profilu");
//         }
//
//         // Usuń pola z null lub pustym stringiem
//         const filteredData = Object.fromEntries(
//             Object.entries(newData).filter(([_, v]) => v !== null && v !== '')
//         );
//
//         await api.put(`/api/profile/${profileIdToUpdate}`, filteredData);
//         await fetchProfileData();
//     };
//
//     return (
//         <ProfileContext.Provider value={{ ...profileContext, updatePersonal }}>
//             {children}
//         </ProfileContext.Provider>
//     );
// };
//
// export const useProfileContext = () => useContext(ProfileContext);
//

// // src/context/ProfileContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';
// import { useParams } from 'react-router-dom';
//
// const ProfileContext = createContext();
//
// export const ProfileProvider = ({ children }) => {
//     const { userId: urlUserId } = useParams() || {};
//     const [profileContext, setProfileContext] = useState({
//         isEditable: false,
//         isViewable: false,
//         profileId: null,
//         loading: true,
//         error: null,
//         personal: null,
//     });
//
//     const fetchProfileData = async () => {
//         try {
//             let userId = urlUserId || 'me';
//             const contextResponse = await api.get(`/api/profile/context/${userId}`);
//             const { userId: profileId, editable, viewable, owner } = contextResponse.data;
//             const personalResponse = await api.get(`/api/profile/${userId}`);
//             const personal = personalResponse.data;
//             setProfileContext({
//                 isEditable: editable,
//                 isViewable: viewable,
//                 profileId,
//                 loading: false,
//                 error: null,
//                 personal,
//             });
//         } catch (err) {
//             setProfileContext({
//                 isEditable: false,
//                 isViewable: false,
//                 profileId: null,
//                 loading: false,
//                 error: `Błąd: ${err.message}`,
//                 personal: null,
//             });
//         }
//     };
//
//     useEffect(() => {
//         fetchProfileData();
//         // eslint-disable-next-line
//     }, [urlUserId]);
//
//     // Funkcja do aktualizacji danych personalnych
//     const updatePersonal = async (newData) => {
//         const userId = profileContext.profileId || 'me';
//         // Usuń pola z null lub pustym stringiem
//         const filteredData = Object.fromEntries(
//             Object.entries(newData).filter(([_, v]) => v !== null && v !== '')
//         );
//         await api.put(`/api/profile/${userId}`, filteredData);
//         await fetchProfileData();
//     };
//
//     return (
//         <ProfileContext.Provider value={{ ...profileContext, updatePersonal }}>
//             {children}
//         </ProfileContext.Provider>
//     );
// };
//
// export const useProfileContext = () => useContext(ProfileContext);