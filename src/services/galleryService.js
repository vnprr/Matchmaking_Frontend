// src/services/galleryService.js
import api from './api';

// Fetch all images for the current user
export const fetchUserImages = async () => {
    const res = await api.get('/api/profile/me/images/all');
    return res.data;
};

// Fetch avatar image for the current user
export const fetchUserAvatar = async () => {
    const res = await api.get('/api/profile/me/images/avatar');
    return res.data;
};

// Fetch all images for another user
export const fetchProfileImages = async (profileId) => {
    const numericProfileId = Number(profileId); // Ensure profileId is a number
    const res = await api.get(`/api/profile/${numericProfileId}/images/all`);
    return res.data;
};

// Fetch avatar image for another user
export const fetchProfileAvatar = async (profileId) => {
    const numericProfileId = Number(profileId); // Ensure profileId is a number
    const res = await api.get(`/api/profile/${numericProfileId}/images/avatar`);
    return res.data;
};

// Upload a new image
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Crop gallery image (affects gallery and thumbnail versions)
export const cropImage = async (imageId, crop) => {
    // Ensure imageId is a number
    const numericImageId = Number(imageId);
    const res = await api.post(`/api/profile/images/${numericImageId}/crop`, crop);
    return res.data;
};

// Set avatar image (requires square 1:1 crop)
export const setAvatarImage = async (imageId, crop) => {
    // Ensure imageId is a number
    const numericImageId = Number(imageId);
    const res = await api.patch(`/api/profile/images/${numericImageId}/avatar`, crop);
    return res.data;
};

// Change the display order of images
export const updateOrder = async (orderDTO) => {
    await api.put('/api/profile/images/order', orderDTO);
};

// Delete an image
export const deleteImage = async (imageId) => {
    // Ensure imageId is a number
    const numericImageId = Number(imageId);
    await api.delete(`/api/profile/images/${numericImageId}`);
};

// Get a single image by ID
export const getImageById = async (imageId) => {
    // Ensure imageId is a number
    const numericImageId = Number(imageId);
    const res = await api.get(`/api/profile/images/${numericImageId}`);
    return res.data;
};
