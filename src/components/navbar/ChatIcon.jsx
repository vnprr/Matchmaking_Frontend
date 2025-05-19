// src/components/navbar/ChatIcon.jsx
import { useState, useEffect } from 'react';
import { Box, IconButton, Badge, Tooltip } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getUnreadCount } from '../../services/chatService';

const NavbarChatIcon = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    // Pobieranie liczby nieprzeczytanych wiadomości
    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Błąd pobierania nieprzeczytanych wiadomości:', error);
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
            <Tooltip label="Wiadomości" placement="bottom">
                <IconButton
                    as={RouterLink}
                    to="/chat"
                    icon={<ChatIcon />}
                    variant="ghost"
                    aria-label="Wiadomości"
                    size="md"
                />
            </Tooltip>

            {unreadCount > 0 && (
                <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="0"
                    right="0"
                    fontSize="0.8em"
                >
                    {unreadCount}
                </Badge>
            )}
        </Box>
    );
};

export default NavbarChatIcon;