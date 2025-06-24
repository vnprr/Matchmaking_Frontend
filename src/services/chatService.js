// src/services/chatService.js
import { apiCall } from '../utils/apiUtils';

// Pobieranie listy konwersacji z paginacją
export const getConversations = async (page = 0, size = 10) => {
    return apiCall('/api/chat/conversations', 'get', null, {
        params: { page, size }
    });
};

// Pobieranie wiadomości z konwersacji
export const getConversationMessages = async (conversationId, page = 0, size = 20) => {
    return apiCall(`/api/chat/conversations/${conversationId}/messages`, 'get', null, {
        params: { page, size }
    });
};

// Wysyłanie wiadomości do profilu
export const sendMessage = async (recipientProfileId, content) => {
    return apiCall(`/api/chat/conversations/profile/${recipientProfileId}`, 'post', {
        content: content
    });
};

// Oznaczanie konwersacji jako przeczytanej
export const markConversationAsRead = async (conversationId) => {
    return apiCall(`/api/chat/conversations/${conversationId}/read`, 'patch');
};

// Pobieranie liczby nieprzeczytanych wiadomości
export const getUnreadCount = async () => {
    return apiCall('/api/chat/unread-count', 'get');
};
