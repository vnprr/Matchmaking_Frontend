import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Flex,
    IconButton,
    Image,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Badge,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NotificationsMenu = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const bgColor = useColorModeValue('white', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.100', 'gray.600');

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/notifications');
            setNotifications(response.data.content || []);
            const unread = response.data.content.filter(notification => !notification.read).length;
            setUnreadCount(unread);
            setError(null);
        } catch (err) {
            console.error('Błąd podczas pobierania powiadomień', err);
            setError('Nie udało się pobrać powiadomień');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                await api.put(`/api/notifications/${notification.id}/read`);

                // Aktualizacja lokalnego stanu
                setNotifications(notifications.map(n =>
                    n.id === notification.id ? {...n, read: true} : n
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            // Obsługa nawigacji w zależności od typu powiadomienia
            if (notification.type === 'NEW_RECOMMENDATION' && notification.targetId) {
                navigate(`/profile/${notification.targetId}`);
            }
        } catch (err) {
            console.error('Błąd podczas oznaczania powiadomienia jako przeczytane', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({...n, read: true})));
            setUnreadCount(0);
        } catch (err) {
            console.error('Błąd podczas oznaczania powiadomień jako przeczytane', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Popover placement="bottom-end">
            <PopoverTrigger>
                <Box position="relative" display="inline-block">
                    <IconButton
                        icon={<BellIcon />}
                        variant="ghost"
                        aria-label="Powiadomienia"
                        fontSize="20px"
                    />
                    {unreadCount > 0 && (
                        <Badge
                            colorScheme="red"
                            borderRadius="full"
                            position="absolute"
                            top="-2px"
                            right="-2px"
                            fontSize="xs"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Box>
            </PopoverTrigger>
            <PopoverContent width="350px">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    <Flex justify="space-between" align="center">
                        <Text fontWeight="bold">Powiadomienia</Text>
                        {unreadCount > 0 && (
                            <Button size="xs" onClick={markAllAsRead}>
                                Oznacz wszystkie jako przeczytane
                            </Button>
                        )}
                    </Flex>
                </PopoverHeader>
                <PopoverBody maxHeight="400px" overflowY="auto" p={0}>
                    {loading ? (
                        <Flex justify="center" align="center" py={4}>
                            <Spinner />
                        </Flex>
                    ) : error ? (
                        <Box p={4} textAlign="center">
                            <Text color="red.500">{error}</Text>
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <Text color="gray.500">Brak powiadomień</Text>
                        </Box>
                    ) : (
                        notifications.map((notification) => (
                            <Box
                                key={notification.id}
                                p={3}
                                borderBottomWidth="1px"
                                bg={notification.read ? bgColor : 'blue.50'}
                                _hover={{ bg: hoverBgColor }}
                                cursor="pointer"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <Flex>
                                    {notification.photoUrl && (
                                        <Box mr={3} flexShrink={0}>
                                            <Image
                                                src={notification.photoUrl}
                                                alt="Miniatura"
                                                boxSize="40px"
                                                borderRadius="full"
                                                objectFit="cover"
                                            />
                                        </Box>
                                    )}
                                    <Box flex="1">
                                        <Text fontSize="sm">{notification.content}</Text>
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            {formatDate(notification.createdAt)}
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        ))
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationsMenu;