// src/services/galleryService.js
import api from './api';

// Pobierz wszystkie zdjęcia obecnego użytkownika
export const fetchUserImages = async () => {
    const res = await api.get('/api/profile/me/images/all');
    return res.data;
};

// Upload nowego zdjęcia
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Kadrowanie zdjęcia
export const cropImage = async (imageId, crop) => {
    const res = await api.post(`/api/profile/images/${imageId}/crop`, crop);
    return res.data;
};

// Zmiana kolejności zdjęć
export const updateOrder = async (orderDTO) => {
    await api.put('/api/profile/images/order', orderDTO);
};

// Usunięcie zdjęcia
export const deleteImage = async (imageId) => {
    await api.delete(`/api/profile/images/${imageId}`);
};


/*
    * @param {string} imageId - ID zdjęcia do ustawienia jako główne
    * @returns {Promise} - Obietnica z danymi odpowiedzi
    *
    * Ustawia zdjęcie jako główne zdjęcie profilu
 */
export const setMainImage = async (imageId) => {
    const res = await api.patch(`/api/profile/images/${imageId}/main`);
    return res.data;
};
