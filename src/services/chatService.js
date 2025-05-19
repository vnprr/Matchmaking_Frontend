// src/services/chatService.js
import api from './api';

// Pobieranie listy konwersacji z paginacją
export const getConversations = async (page = 0, size = 10) => {
    const response = await api.get('/api/chat/conversations', {
        params: { page, size }
    });
    return response.data;
};

// Pobieranie wiadomości z konwersacji
export const getConversationMessages = async (conversationId, page = 0, size = 20) => {
    const response = await api.get(`/api/chat/conversations/${conversationId}/messages`, {
        params: { page, size }
    });
    return response.data;
};

// Wysyłanie wiadomości do profilu
export const sendMessage = async (recipientProfileId, content) => {
    const response = await api.post(`/api/chat/conversations/profile/${recipientProfileId}`, {
        content: content
    });
    return response.data;
};

// Oznaczanie konwersacji jako przeczytanej
export const markConversationAsRead = async (conversationId) => {
    await api.patch(`/api/chat/conversations/${conversationId}/read`);
};

// Pobieranie liczby nieprzeczytanych wiadomości
export const getUnreadCount = async () => {
    const response = await api.get('/api/chat/unread-count');
    return response.data;
};