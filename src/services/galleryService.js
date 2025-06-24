import { apiCall } from '../utils/apiUtils';

const ensureNumericId = (id) => Number(id);

// Pobieranie wszystkich obrazów obecnego użytkownika
export const fetchUserImages = async () => {
    return apiCall('/api/profile/me/images/all', 'get');
};

// Pobieranie głównego obrazu obecnego użytkownika
export const fetchUserAvatar = async () => {
    return apiCall('/api/profile/me/images/avatar', 'get');
};

// Pobieranie obrazów profilu o id
export const fetchProfileImages = async (profileId) => {
    return apiCall(`/api/profile/${ensureNumericId(profileId)}/images/all`, 'get');
};

// Pobieranie głównego obrazu profilu o id
export const fetchProfileAvatar = async (profileId) => {
    return apiCall(`/api/profile/${ensureNumericId(profileId)}/images/avatar`, 'get');
};

// wysyłanie obrazu
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall('/api/profile', 'post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

//kadrowanie obrazu
export const cropImage = async (imageId, crop) => {
    return apiCall(`/api/profile/images/${ensureNumericId(imageId)}/crop`, 'post', crop);
};

// Ustawianie obrazu jako avatar
export const setAvatarImage = async (imageId, crop) => {
    return apiCall(`/api/profile/images/${ensureNumericId(imageId)}/avatar`, 'patch', crop);
};

// Zmień kolejność obrazów
export const updateOrder = async (orderDTO) => {
    return apiCall('/api/profile/images/order', 'put', orderDTO);
};

// Usuwanie obrazu
export const deleteImage = async (imageId) => {
    return apiCall(`/api/profile/images/${ensureNumericId(imageId)}`, 'delete');
};

// Pobieranie obrazu po ID
export const getImageById = async (imageId) => {
    return apiCall(`/api/profile/images/${ensureNumericId(imageId)}`, 'get');
};
