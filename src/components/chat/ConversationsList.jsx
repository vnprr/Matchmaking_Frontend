// src/components/chat/ConversationsList.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Text,
    Flex,
    Badge,
    Spinner,
    Input,
    InputGroup,
    InputLeftElement,
    Divider,
    useColorModeValue
} from '@chakra-ui/react';
import ProfileChatAvatar from '../profile/ProfileChatAvatar';
import { SearchIcon } from '@chakra-ui/icons';
import { getConversations } from '../../services/chatService';

const ConversationsList = ({ onSelectConversation, selectedConversationId }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const bgSelected = useColorModeValue('blue.50', 'blue.900');
    const hoverBg = useColorModeValue('gray.100', 'gray.600');

    useEffect(() => {
        fetchConversations();

        // Odświeżanie listy co 15 sekund
        const interval = setInterval(fetchConversations, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await getConversations(0, 50);
            if (data && Array.isArray(data.content)) {
                setConversations(data.content);
            }
        } catch (err) {
            console.error('Błąd pobierania konwersacji:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conversation =>
        conversation.recipientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            // Dzisiaj - pokaż tylko godzinę
            return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        } else {
            // Inny dzień - pokaż skróconą datę
            return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
        }
    };

    return (
        <Box
            height="100%"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            display="flex"
            flexDirection="column"
        >
            <Box p={3} borderBottomWidth="1px">
                <Text fontWeight="bold" mb={3}>Wiadomości</Text>
                <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        placeholder="Szukaj..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        rounded="md"
                    />
                </InputGroup>
            </Box>

            {loading ? (
                <Flex flex="1" justify="center" align="center">
                    <Spinner />
                </Flex>
            ) : (
                <Box overflowY="auto" flex="1">
                    {filteredConversations.length > 0 ? (
                        <VStack spacing={0} align="stretch">
                            {filteredConversations.map((conversation) => (
                                <Box
                                    key={conversation.id}
                                    p={3}
                                    cursor="pointer"
                                    bg={selectedConversationId === conversation.id ? bgSelected : 'transparent'}
                                    _hover={{ bg: selectedConversationId === conversation.id ? bgSelected : hoverBg }}
                                    onClick={() => onSelectConversation(conversation)}
                                    borderBottomWidth="1px"
                                >
                                    <Flex>
                                        <ProfileChatAvatar
                                            profileId={conversation.recipientId}
                                            size="sm"
                                            name={conversation.recipientName || 'Użytkownik'}
                                            mr={3}
                                        />
                                        <Box flex="1" overflow="hidden">
                                            <Flex justify="space-between" align="center">
                                                <Text fontWeight="bold" isTruncated>
                                                    {conversation.recipientName || 'Użytkownik'}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    {formatDate(conversation.lastMessageDate)}
                                                </Text>
                                            </Flex>
                                            <Flex align="center" justify="space-between">
                                                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                                    {conversation.lastMessage || '(brak wiadomości)'}
                                                </Text>
                                                {conversation.unreadCount > 0 && (
                                                    <Badge colorScheme="blue" borderRadius="full" fontSize="xs">
                                                        {conversation.unreadCount}
                                                    </Badge>
                                                )}
                                            </Flex>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Flex justify="center" pt={10}>
                            <Text color="gray.500">Brak konwersacji</Text>
                        </Flex>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ConversationsList;
