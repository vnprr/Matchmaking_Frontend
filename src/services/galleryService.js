// src/services/imageService.js
import api from './api';

// Pobieranie wszystkich zdjęć profilu
export const fetchProfileImages = async () => {
    const response = await api.get('/api/profile/images');
    return response.data || [];
};

// Dodawanie nowego zdjęcia
export const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/profile/images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Ustawienie zdjęcia jako główne
export const setMainProfileImage = async (imageId) => {
    await api.put(`/api/profile/images/${imageId}/main`);
};

// Usunięcie zdjęcia
export const deleteProfileImage = async (imageId) => {
    await api.delete(`/api/profile/images/${imageId}`);
};

// Walidacja pliku
export const validateImageFile = (file, maxSizeMB = 5) => {
    if (!file) return { valid: false, message: "Nie wybrano pliku" };

    if (!file.type.startsWith('image/')) {
        return { valid: false, message: "Proszę wybrać plik graficzny" };
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
        return { valid: false, message: `Maksymalny rozmiar pliku to ${maxSizeMB}MB` };
    }

    return { valid: true };
};