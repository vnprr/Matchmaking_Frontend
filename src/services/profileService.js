// src/services/profileService.js
import api from './api';

// Pobierz profil zalogowanego użytkownika
export const getCurrentUserProfile = async () => {
    const response = await api.get('/api/profile');
    return response.data;
};

// Pobierz profil użytkownika po ID
export const getUserProfileById = async (userId) => {
    const response = await api.get(`/api/profile/${userId}`);
    return response.data;
};

// Pobierz zdjęcia profilu (własnego lub innego użytkownika)
export const getProfileImages = async (userId = null) => {
    const endpoint = userId
        ? `/api/profile/${userId}/images`
        : '/api/profile/images';
    const response = await api.get(endpoint);
    return response.data || [];
};

// Pobierz główne zdjęcie profilu
export const getMainProfileImage = async (userId = null) => {
    const endpoint = userId
        ? `/api/profile/${userId}/images/main`
        : '/api/profile/images/main';
    const response = await api.get(endpoint);
    return response.data;
};

// Pobierz sekcje profilu (dla siebie lub innego użytkownika)
export const getProfileSections = async (profileId = null) => {
    const endpoint = profileId ? `/api/profile/sections/${profileId}` : '/api/profile/sections/me';
    const response = await api.get(endpoint);
    return response.data;
};

// Zaktualizuj treść sekcji (tylko dla siebie)
export const updateProfileSection = async (sectionId, content) => {
    await api.put(`/api/profile/sections/me/${sectionId}`, { content });
};


// // src/services/profileService.js
// import api from './api';
//
// // Pobierz profil zalogowanego użytkownika
// export const getCurrentUserProfile = async () => {
//     const response = await api.get('/api/profile');
//     return response.data;
// };
//
// // Pobierz profil użytkownika po ID
// export const getUserProfileById = async (userId) => {
//     const response = await api.get(`/api/profile/${userId}`);
//     return response.data;
// };
//
// // Pobierz zdjęcia profilu (własnego lub innego użytkownika)
// export const getProfileImages = async (userId = null) => {
//     const endpoint = userId
//         ? `/api/profile/${userId}/images`
//         : '/api/profile/images';
//     const response = await api.get(endpoint);
//     return response.data || [];
// };
//
// // Pobierz główne zdjęcie profilu
// export const getMainProfileImage = async (userId = null) => {
//     const endpoint = userId
//         ? `/api/profile/${userId}/images/main`
//         : '/api/profile/images/main';
//     const response = await api.get(endpoint);
//     return response.data;
// };
//
// // Pozostałe metody (updateProfile, uploadImage, itd.) dostępne tylko dla własnego profilu