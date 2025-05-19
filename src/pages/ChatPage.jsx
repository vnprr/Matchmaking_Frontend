// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import {
    Container,
    Box,
    Grid,
    GridItem,
    Text,
    Flex,
    Input,
    IconButton,
    Spinner,
    useColorModeValue,
    Avatar,
    useToast
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import ConversationsList from '../components/chat/ConversationsList.jsx';
import { getConversationMessages, sendMessage, markConversationAsRead } from '../services/chatService';

const ChatPage = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const toast = useToast();

    // Kolory dla trybu jasnego i ciemnego
    const bgColor = useColorModeValue('white', 'gray.700');
    const messageBgSent = useColorModeValue('blue.500', 'blue.600');
    const messageBgReceived = useColorModeValue('gray.100', 'gray.600');
    const messageColorSent = useColorModeValue('white', 'white');
    const messageColorReceived = useColorModeValue('black', 'white');

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);

            if (selectedConversation.unreadCount > 0) {
                markConversationAsRead(selectedConversation.id)
                    .catch(error => {
                        console.error('Błąd podczas oznaczania wiadomości jako przeczytane:', error);
                    });
            }
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async (conversationId) => {
        try {
            setLoading(true);
            const response = await getConversationMessages(conversationId);

            if (Array.isArray(response.content)) {
                setMessages(response.content.reverse());
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Błąd podczas pobierania wiadomości:', error);
            toast({
                title: "Błąd",
                description: "Nie udało się pobrać wiadomości",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const messageToSend = newMessage;

        try {
            setLoading(true);
            setNewMessage('');

            // Dodajemy tymczasową wiadomość do UI z flagą ownMessage: true
            const tempMessage = {
                id: `temp-${Date.now()}`,
                content: messageToSend,
                createdAt: new Date().toISOString(),
                ownMessage: true,
                temp: true
            };
            setMessages(prev => [...prev, tempMessage]);

            await sendMessage(selectedConversation.recipientId, messageToSend);

            // Odświeżamy wszystkie wiadomości po wysłaniu
            fetchMessages(selectedConversation.id);
        } catch (error) {
            console.error('Błąd podczas wysyłania wiadomości:', error);
            toast({
                title: "Błąd",
                description: "Nie udało się wysłać wiadomości",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setNewMessage(messageToSend);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container maxW="container.xl" py={5} height="calc(100vh - 100px)">
            <Grid templateColumns={{base: "1fr", md: "300px 1fr"}} gap={4} height="100%">
                <GridItem>
                    <ConversationsList
                        onSelectConversation={setSelectedConversation}
                        selectedConversationId={selectedConversation?.id}
                    />
                </GridItem>
                <GridItem height="100%">
                    <Box
                        height="100%"
                        borderWidth="1px"
                        borderRadius="md"
                        overflow="hidden"
                        display="flex"
                        flexDirection="column"
                        bg={bgColor}
                    >
                        {selectedConversation ? (
                            <>
                                <Box p={3} borderBottomWidth="1px">
                                    <Flex align="center">
                                        <Avatar
                                            size="sm"
                                            name={selectedConversation.recipientName || 'Użytkownik'}
                                            src={selectedConversation.recipientAvatarUrl}
                                            mr={3}
                                        />
                                        <Text fontWeight="bold">{selectedConversation.recipientName || 'Użytkownik'}</Text>
                                    </Flex>
                                </Box>

                                <Box
                                    flex="1"
                                    overflowY="auto"
                                    p={4}
                                    ref={messagesContainerRef}
                                >
                                    {loading && messages.length === 0 ? (
                                        <Flex justify="center" align="center" height="100%">
                                            <Spinner />
                                        </Flex>
                                    ) : (
                                        messages.map((message) => (
                                            <Flex
                                                key={message.id}
                                                justify={message.ownMessage ? "flex-end" : "flex-start"}
                                                mb={2}
                                            >
                                                <Box
                                                    maxWidth="70%"
                                                    bg={message.ownMessage ? messageBgSent : messageBgReceived}
                                                    color={message.ownMessage ? messageColorSent : messageColorReceived}
                                                    borderRadius="lg"
                                                    px={3}
                                                    py={2}
                                                >
                                                    <Text>{message.content}</Text>
                                                    <Text fontSize="xs" color={message.ownMessage ? "blue.50" : "gray.500"} textAlign="right">
                                                        {formatMessageTime(message.createdAt)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </Box>

                                <Box p={3} borderTopWidth="1px">
                                    <Flex>
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Wpisz wiadomość..."
                                            mr={2}
                                        />
                                        <IconButton
                                            colorScheme="blue"
                                            icon={<ArrowForwardIcon />}
                                            onClick={handleSendMessage}
                                            isDisabled={!newMessage.trim() || loading}
                                            aria-label="Wyślij wiadomość"
                                        />
                                    </Flex>
                                </Box>
                            </>
                        ) : (
                            <Flex justify="center" align="center" height="100%">
                                <Text color="gray.500">Wybierz konwersację</Text>
                            </Flex>
                        )}
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default ChatPage;

// // src/pages/ChatPage.jsx
// import { useState, useEffect, useRef } from 'react';
// import {
//     Container,
//     Box,
//     Grid,
//     GridItem,
//     Text,
//     Flex,
//     Input,
//     IconButton,
//     Spinner,
//     useColorModeValue,
//     Avatar,
//     VStack,
//     useToast
// } from '@chakra-ui/react';
// import { ArrowForwardIcon } from '@chakra-ui/icons';
// import ConversationsList from '../components/chat/ConversationsList.jsx';
// import { getConversationMessages, sendMessage, markConversationAsRead } from '../services/chatService';
//
// const ChatPage = () => {
//     const [selectedConversation, setSelectedConversation] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(false);
//     const messagesEndRef = useRef(null);
//     const messagesContainerRef = useRef(null);
//     const toast = useToast();
//
//     // Kolory dla trybu jasnego i ciemnego
//     const bgColor = useColorModeValue('white', 'gray.700');
//     const messageBgSent = useColorModeValue('blue.500', 'blue.600');
//     const messageBgReceived = useColorModeValue('gray.100', 'gray.600');
//     const messageColorSent = useColorModeValue('white', 'white');
//     const messageColorReceived = useColorModeValue('black', 'white');
//
//     useEffect(() => {
//         if (selectedConversation) {
//             fetchMessages(selectedConversation.id);
//
//             if (selectedConversation.unreadCount > 0) {
//                 markConversationAsRead(selectedConversation.id)
//                     .catch(error => {
//                         console.error('Błąd podczas oznaczania wiadomości jako przeczytane:', error);
//                     });
//             }
//         }
//     }, [selectedConversation]);
//
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);
//
//     const fetchMessages = async (conversationId) => {
//         try {
//             setLoading(true);
//             const response = await getConversationMessages(conversationId);
//
//             if (Array.isArray(response.content)) {
//                 // Odwracamy kolejność wiadomości, aby najnowsze były na dole
//                 setMessages(response.content.reverse());
//             } else {
//                 setMessages([]);
//             }
//         } catch (error) {
//             console.error('Błąd podczas pobierania wiadomości:', error);
//             toast({
//                 title: "Błąd",
//                 description: "Nie udało się pobrać wiadomości",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleSendMessage = async () => {
//         if (!newMessage.trim() || !selectedConversation) return;
//
//         // Definiujemy zmienną poza blokiem try, aby była dostępna w catch
//         const messageToSend = newMessage;
//
//         try {
//             setLoading(true);
//             setNewMessage('');
//
//             // Dodajemy tymczasową wiadomość do UI
//             const tempMessage = {
//                 id: `temp-${Date.now()}`,
//                 content: messageToSend,
//                 createdAt: new Date().toISOString(),
//                 sender: true, // To oznacza, że to nasza wiadomość
//                 temp: true
//             };
//             setMessages(prev => [...prev, tempMessage]);
//
//             await sendMessage(selectedConversation.recipientId, messageToSend);
//
//             // Odświeżamy wszystkie wiadomości po wysłaniu
//             fetchMessages(selectedConversation.id);
//         } catch (error) {
//             console.error('Błąd podczas wysyłania wiadomości:', error);
//             toast({
//                 title: "Błąd",
//                 description: "Nie udało się wysłać wiadomości",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//             });
//             // Przywracamy wiadomość do pola tekstowego w przypadku błędu
//             setNewMessage(messageToSend);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };
//
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };
//
//     const formatMessageTime = (timestamp) => {
//         if (!timestamp) return '';
//         return new Date(timestamp).toLocaleTimeString('pl-PL', {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };
//
//     return (
//         <Container maxW="container.xl" py={5} height="calc(100vh - 100px)">
//             <Grid templateColumns={{base: "1fr", md: "300px 1fr"}} gap={4} height="100%">
//                 <GridItem>
//                     <ConversationsList
//                         onSelectConversation={setSelectedConversation}
//                         selectedConversationId={selectedConversation?.id}
//                     />
//                 </GridItem>
//                 <GridItem>
//                     <Box
//                         height="90vh"
//                         borderWidth="1px"
//                         borderRadius="md"
//                         overflow="hidden"
//                         display="flex"
//                         flexDirection="column"
//                         bg={bgColor}
//                     >
//                         {selectedConversation ? (
//                             <>
//                                 <Box p={3} borderBottomWidth="1px">
//                                     <Flex align="center">
//                                         <Avatar
//                                             size="sm"
//                                             name={selectedConversation.recipientName}
//                                             src={selectedConversation.recipientAvatarUrl}
//                                             mr={3}
//                                         />
//                                         <Text fontWeight="bold">{selectedConversation.recipientName}</Text>
//                                     </Flex>
//                                 </Box>
//
//                                 <Box
//                                     flex="1"
//                                     overflowY="auto"
//                                     p={4}
//                                     ref={messagesContainerRef}
//                                 >
//                                     <VStack spacing={4} align="stretch">
//                                         {loading && messages.length === 0 ? (
//                                             <Flex justify="center" align="center" height="100%">
//                                                 <Spinner />
//                                             </Flex>
//                                         ) : (
//                                             messages.map((message) => (
//                                                 <Flex
//                                                     key={message.id}
//                                                     justify={message.sender ? "flex-end" : "flex-start"}
//                                                     width="100%"
//                                                 >
//                                                     <Box
//                                                         maxW="70%"
//                                                         bg={message.sender ? messageBgSent : messageBgReceived}
//                                                         color={message.sender ? messageColorSent : messageColorReceived}
//                                                         p={3}
//                                                         borderRadius="lg"
//                                                     >
//                                                         <Text>{message.content}</Text>
//                                                         <Text
//                                                             fontSize="xs"
//                                                             color={message.sender ? "gray.300" : "gray.500"}
//                                                             textAlign="right"
//                                                             mt={1}
//                                                         >
//                                                             {formatMessageTime(message.createdAt || message.timestamp)}
//                                                         </Text>
//                                                     </Box>
//                                                 </Flex>
//                                             ))
//                                         )}
//                                         <div ref={messagesEndRef} />
//                                     </VStack>
//                                 </Box>
//
//                                 <Box p={3} borderTopWidth="1px">
//                                     <Flex>
//                                         <Input
//                                             value={newMessage}
//                                             onChange={(e) => setNewMessage(e.target.value)}
//                                             placeholder="Wpisz wiadomość..."
//                                             onKeyPress={handleKeyPress}
//                                             mr={2}
//                                         />
//                                         <IconButton
//                                             icon={<ArrowForwardIcon />}
//                                             colorScheme="blue"
//                                             onClick={handleSendMessage}
//                                             isLoading={loading}
//                                         />
//                                     </Flex>
//                                 </Box>
//                             </>
//                         ) : (
//                             <Flex justify="center" align="center" height="100%">
//                                 <Text color="gray.500">Wybierz konwersację, aby rozpocząć czat</Text>
//                             </Flex>
//                         )}
//                     </Box>
//                 </GridItem>
//             </Grid>
//         </Container>
//     );
// };
//
// export default ChatPage;