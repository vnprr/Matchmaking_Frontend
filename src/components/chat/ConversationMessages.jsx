// src/components/chat/ConversationMessages.jsx
import { useState, useEffect, useRef } from 'react';
import {
    Box,
    VStack,
    Text,
    Flex,
    Spinner,
    FormControl,
    Input,
    Button,
    IconButton
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { getConversationMessages, sendMessage, markConversationAsRead } from '../../services/chatService';

const ConversationMessages = ({ conversation, onNewMessage }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [sending, setSending] = useState(false);

    const loadMessages = async (reset = false) => {
        if (!conversation) return;

        try {
            if (reset) {
                setLoading(true);
                setPage(0);
            } else {
                setLoadingMore(true);
            }

            const data = await getConversationMessages(conversation.id, reset ? 0 : page + 1);

            if (reset) {
                setMessages(data.content.reverse());
                // Po załadowaniu oznacz konwersację jako przeczytaną
                await markConversationAsRead(conversation.id);
            } else {
                setMessages(prev => [...data.content.reverse(), ...prev]);
            }

            setHasMore(!data.first);
            if (!reset) setPage(prev => prev + 1);
        } catch (error) {
            console.error('Błąd podczas ładowania wiadomości', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (conversation?.id) {
            loadMessages(true);
        }
    }, [conversation?.id]);

    useEffect(() => {
        if (!loading && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleScroll = () => {
        const { scrollTop } = messagesContainerRef.current;

        if (scrollTop < 100 && !loadingMore && hasMore) {
            loadMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || sending || newMessage.length > 2000) return;

        try {
            setSending(true);

            const tempMessage = {
                id: `temp-${Date.now()}`,
                content: newMessage,
                createdAt: new Date().toISOString(),
                isOwnMessage: true,
                temp: true
            };

            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');

            // Faktyczne wysłanie wiadomości
            const sentMessage = await sendMessage(conversation.recipient.id, newMessage);

            // Zaktualizuj stan z faktycznymi danymi
            setMessages(prev => prev.map(msg =>
                msg.temp && msg.id === tempMessage.id ? sentMessage : msg
            ));

            // Powiadom rodzica o nowej wiadomości
            if (onNewMessage) onNewMessage();
        } catch (error) {
            console.error('Błąd podczas wysyłania wiadomości', error);
            // Możemy oznaczyć wiadomość jako błędną lub usunąć ją w razie niepowodzenia
        } finally {
            setSending(false);

            // Przewiń na dół po wysłaniu wiadomości
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    if (!conversation) {
        return (
            <Flex justify="center" align="center" h="full">
                <Text color="gray.500">Wybierz konwersację</Text>
            </Flex>
        );
    }

    return (
        <Flex direction="column" h="full">
            <Box flex="1" overflowY="auto" ref={messagesContainerRef} onScroll={handleScroll} p={4}>
                {loadingMore && (
                    <Flex justify="center" p={2}>
                        <Spinner size="sm" />
                    </Flex>
                )}

                <VStack spacing={4} align="stretch">
                    {messages.map(message => (
                        <Flex
                            key={message.id}
                            justify={message.isOwnMessage ? "flex-end" : "flex-start"}
                        >
                            <Box
                                maxW="70%"
                                bg={message.isOwnMessage ? "blue.500" : "gray.100"}
                                color={message.isOwnMessage ? "white" : "black"}
                                p={3}
                                borderRadius="lg"
                            >
                                <Text>{message.content}</Text>
                                <Text fontSize="xs" color={message.isOwnMessage ? "blue.100" : "gray.500"} textAlign="right" mt={1}>
                                    {new Date(message.createdAt).toLocaleTimeString('pl-PL', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                    <div ref={messagesEndRef} />
                </VStack>
            </Box>

            <Box p={3} borderTop="1px" borderColor="gray.200">
                <form onSubmit={handleSendMessage}>
                    <Flex>
                        <FormControl>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Wpisz wiadomość..."
                                maxLength={2000}
                            />
                        </FormControl>
                        <IconButton
                            type="submit"
                            icon={<ArrowUpIcon />}
                            colorScheme="blue"
                            ml={2}
                            isLoading={sending}
                            isDisabled={!newMessage.trim() || newMessage.length > 2000}
                            aria-label="Wyślij wiadomość"
                        />
                    </Flex>
                </form>
            </Box>
        </Flex>
    );
};

export default ConversationMessages;