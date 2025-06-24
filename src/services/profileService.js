import { apiCall } from '../utils/apiUtils';

export const getCurrentUserProfile = async () => {
    return apiCall('/api/profile', 'get');
};

export const getUserProfileById = async (userId) => {
    return apiCall(`/api/profile/${userId}`, 'get');
};



// Pobieranie sekcji profilu
export const getProfileSections = async (profileId = null) => {
    const endpoint = profileId ? `/api/profile/sections/${profileId}` : '/api/profile/sections/me';
    return apiCall(endpoint, 'get');
};

// Zaktualizuj sekcję profilu
export const updateProfileSection = async (sectionId, content) => {
    return apiCall(`/api/profile/sections/me/${sectionId}`, 'put', { content });
};
