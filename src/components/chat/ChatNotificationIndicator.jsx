// src/components/ChatNotificationIndicator.jsx
import { useEffect, useState } from 'react';
import { Box, Badge, IconButton } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { getUnreadCount } from '../services/chatService';

const ChatNotificationIndicator = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Błąd podczas pobierania liczby nieprzeczytanych wiadomości', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();

        // Odświeżanie co 30 sekund
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box position="relative" display="inline-block">
            <IconButton
                as={Link}
                to="/chat"
                icon={<ChatIcon />}
                aria-label="Wiadomości"
                variant="ghost"
            />

            {unreadCount > 0 && (
                <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="0"
                    right="0"
                    transform="translate(25%, -25%)"
                >
                    {unreadCount}
                </Badge>
            )}
        </Box>
    );
};

export default ChatNotificationIndicator;