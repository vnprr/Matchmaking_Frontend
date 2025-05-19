// src/components/chat/ConversationsList.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Text,
    Flex,
    Avatar,
    Badge,
    Spinner,
    Input,
    InputGroup,
    InputLeftElement,
    Divider,
    useColorModeValue
} from '@chakra-ui/react';
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
                                        <Avatar
                                            size="sm"
                                            name={conversation.recipientName || 'Użytkownik'}
                                            src={conversation.recipientAvatarUrl}
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

// // src/components/chat/ConversationList.jsx
// import { useState, useEffect } from 'react';
// import {
//     Box,
//     VStack,
//     Flex,
//     Text,
//     Avatar,
//     Badge,
//     Spinner,
//     Divider,
//     Button,
//     useColorModeValue
// } from '@chakra-ui/react';
// import { ChevronDownIcon } from '@chakra-ui/icons';
// import { getConversations } from '../../services/chatService';
//
// const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
//     const [conversations, setConversations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const [hasMore, setHasMore] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//
//     const bgColor = useColorModeValue('white', 'gray.700');
//     const hoverBg = useColorModeValue('gray.50', 'gray.600');
//     const selectedBg = useColorModeValue('blue.50', 'blue.900');
//     const borderColor = useColorModeValue('gray.200', 'gray.600');
//
//     useEffect(() => {
//         fetchConversations();
//     }, []);
//
//     const fetchConversations = async (refresh = false) => {
//         try {
//             setLoading(true);
//             const currentPage = refresh ? 0 : page;
//             const data = await getConversations(currentPage, 10);
//
//             if (refresh) {
//                 setConversations(data.content);
//             } else {
//                 setConversations(prev => [...prev, ...data.content]);
//             }
//
//             setHasMore(currentPage < data.totalPages - 1);
//             setPage(refresh ? 0 : currentPage + 1);
//         } catch (error) {
//             console.error('Błąd podczas pobierania konwersacji:', error);
//         } finally {
//             setLoading(false);
//             setLoadingMore(false);
//         }
//     };
//
//     const loadMoreConversations = async () => {
//         if (loadingMore || !hasMore) return;
//         setLoadingMore(true);
//         await fetchConversations();
//     };
//
//     const handleSelectConversation = (conversation) => {
//         onSelectConversation(conversation);
//     };
//
//     const formatLastMessageTime = (timestamp) => {
//         if (!timestamp) return '';
//
//         const date = new Date(timestamp);
//         const now = new Date();
//         const isToday = date.toDateString() === now.toDateString();
//
//         if (isToday) {
//             return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
//         }
//
//         const yesterday = new Date(now);
//         yesterday.setDate(yesterday.getDate() - 1);
//         const isYesterday = date.toDateString() === yesterday.toDateString();
//
//         if (isYesterday) {
//             return 'wczoraj';
//         }
//
//         return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
//     };
//
//     if (loading && conversations.length === 0) {
//         return (
//             <Box height="100%" display="flex" alignItems="center" justifyContent="center">
//                 <Spinner size="xl" />
//             </Box>
//         );
//     }
//
//     return (
//         <Box
//             height="100%"
//             bg={bgColor}
//             borderRadius="md"
//             boxShadow="sm"
//             overflowY="auto"
//             borderWidth="1px"
//             borderColor={borderColor}
//         >
//             <VStack spacing={0} align="stretch">
//                 {conversations.length === 0 ? (
//                     <Box p={4} textAlign="center">
//                         <Text color="gray.500">Brak konwersacji</Text>
//                     </Box>
//                 ) : (
//                     conversations.map((conversation) => (
//                         <Box key={conversation.id}>
//                             <Flex
//                                 p={3}
//                                 alignItems="center"
//                                 bg={selectedConversationId === conversation.id ? selectedBg : bgColor}
//                                 _hover={{ bg: selectedConversationId === conversation.id ? selectedBg : hoverBg }}
//                                 cursor="pointer"
//                                 onClick={() => handleSelectConversation(conversation)}
//                             >
//                                 <Avatar
//                                     size="md"
//                                     name={conversation.recipientName || 'Użytkownik'}
//                                     src={conversation.recipientAvatarUrl}
//                                     mr={3}
//                                 />
//                                 <Box flex={1} minWidth={0}>
//                                     <Flex justifyContent="space-between" alignItems="center">
//                                         <Text fontWeight="bold" noOfLines={1}>
//                                             {conversation.recipientName || 'Użytkownik'}
//                                         </Text>
//                                         <Text fontSize="xs" color="gray.500">
//                                             {formatLastMessageTime(conversation.lastMessageTimestamp)}
//                                         </Text>
//                                     </Flex>
//                                     <Flex alignItems="center">
//                                         <Text fontSize="sm" noOfLines={1} color="gray.500" flexGrow={1}>
//                                             {conversation.lastMessage || 'Brak wiadomości'}
//                                         </Text>
//                                         {conversation.unreadCount > 0 && (
//                                             <Badge colorScheme="blue" borderRadius="full" ml={2}>
//                                                 {conversation.unreadCount}
//                                             </Badge>
//                                         )}
//                                     </Flex>
//                                 </Box>
//                             </Flex>
//                             <Divider />
//                         </Box>
//                     ))
//                 )}
//                 {hasMore && (
//                     <Button
//                         isLoading={loadingMore}
//                         onClick={loadMoreConversations}
//                         variant="ghost"
//                         size="sm"
//                         rightIcon={<ChevronDownIcon />}
//                         m={2}
//                     >
//                         Załaduj więcej
//                     </Button>
//                 )}
//             </VStack>
//         </Box>
//     );
// };
//
// export default ConversationList;

// // src/components/chat/ConversationsList.jsx
// import { useState, useEffect } from 'react';
// import {
//     Box,
//     VStack,
//     Text,
//     Avatar,
//     Badge,
//     Divider,
//     Spinner,
//     Flex
// } from '@chakra-ui/react';
// import { getConversations } from '../../services/chatService';
//
// const ConversationsList = ({ onSelectConversation, selectedConversationId }) => {
//     const [conversations, setConversations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const [hasMore, setHasMore] = useState(true);
//
//     const loadConversations = async (reset = false) => {
//         try {
//             setLoading(true);
//             const pageToLoad = reset ? 0 : page;
//             const data = await getConversations(pageToLoad);
//
//             if (reset) {
//                 setConversations(data.content);
//             } else {
//                 setConversations(prev => [...prev, ...data.content]);
//             }
//
//             setHasMore(!data.last);
//             if (!reset) setPage(prev => prev + 1);
//         } catch (error) {
//             console.error('Błąd podczas ładowania konwersacji', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         loadConversations(true);
//
//         // Odświeżanie listy co 30 sekund
//         const interval = setInterval(() => {
//             loadConversations(true);
//         }, 30000);
//
//         return () => clearInterval(interval);
//     }, []);
//
//     const handleScroll = (e) => {
//         const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//         if (scrollHeight - scrollTop - clientHeight < 100 && !loading && hasMore) {
//             loadConversations();
//         }
//     };
//
//     return (
//         <Box
//             h="full"
//             overflowY="auto"
//             onScroll={handleScroll}
//             borderRight="1px"
//             borderColor="gray.200"
//             w="300px"
//         >
//             <VStack spacing={0} align="stretch">
//                 {conversations.map(conversation => (
//                     <Box
//                         key={conversation.id}
//                         p={3}
//                         cursor="pointer"
//                         bg={selectedConversationId === conversation.id ? "blue.50" : "transparent"}
//                         _hover={{ bg: "gray.50" }}
//                         onClick={() => onSelectConversation(conversation)}
//                         position="relative"
//                     >
//                         <Flex align="center">
//                             <Avatar
//                                 size="sm"
//                                 name={conversation.recipient.name}
//                                 src={conversation.recipient.avatarUrl || undefined}
//                                 mr={3}
//                             />
//                             <Box flex="1">
//                                 <Flex justify="space-between" align="center">
//                                     <Text
//                                         fontWeight={conversation.unreadCount > 0 ? "bold" : "normal"}
//                                         noOfLines={1}
//                                     >
//                                         {conversation.recipient.name}
//                                     </Text>
//                                     <Text fontSize="xs" color="gray.500">
//                                         {new Date(conversation.lastMessageDate).toLocaleDateString('pl-PL')}
//                                     </Text>
//                                 </Flex>
//                                 <Text
//                                     fontSize="sm"
//                                     color="gray.600"
//                                     noOfLines={1}
//                                 >
//                                     {conversation.lastMessageContent}
//                                 </Text>
//                             </Box>
//                             {conversation.unreadCount > 0 && (
//                                 <Badge
//                                     borderRadius="full"
//                                     colorScheme="blue"
//                                     ml={2}
//                                 >
//                                     {conversation.unreadCount}
//                                 </Badge>
//                             )}
//                         </Flex>
//                         <Divider mt={3} />
//                     </Box>
//                 ))}
//                 {loading && (
//                     <Flex justify="center" p={4}>
//                         <Spinner size="sm" />
//                     </Flex>
//                 )}
//             </VStack>
//         </Box>
//     );
// };
//
// export default ConversationsList;