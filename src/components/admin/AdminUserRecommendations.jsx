import { useState, useEffect, useRef } from 'react';
import {
    Box, Heading, Button, Table, Thead, Tbody, Tr, Th, Td,
    Text, Spinner, useDisclosure, Flex, HStack, IconButton,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
    AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import api from '../../services/api';
import UserSearchModal from './UserSearchModal';

const AdminUserRecommendations = ({ userId, profileId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteId, setDeleteId] = useState(null);
    const cancelRef = useRef();

    // Pobieranie rekomendacji
    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/api/recommendations/profile/${profileId}`, {
                params: {
                    page: page,
                    size: 10
                }
            });

            if (response.data) {
                setRecommendations(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setError('Niepoprawny format danych z API');
            }
        } catch (error) {
            console.error('Błąd podczas pobierania rekomendacji:', error);
            setError(`Błąd podczas pobierania rekomendacji: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecommendation = async () => {
        try {
            await api.delete(`/api/recommendations/${deleteId}`);
            setRecommendations(recommendations.filter(r => r.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error('Błąd podczas usuwania rekomendacji:', err);
            setError('Nie udało się usunąć rekomendacji');
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, [userId, page]);

    const handleAddRecommendation = async (selectedProfileId) => {
        try {
            await api.post('/api/recommendations', null, {
                params: {
                    firstProfileId: profileId,
                    secondProfileId: selectedProfileId
                }
            });
            onClose();
            fetchRecommendations();
        } catch (err) {
            console.error('Błąd podczas dodawania rekomendacji:', err);
            setError('Nie udało się dodać rekomendacji');
        }
    };

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Rekomendacje użytkownika</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                    Dodaj rekomendację
                </Button>
            </Flex>

            {error && (
                <Text color="red.500" mb={4}>{error}</Text>
            )}

            {loading ? (
                <Flex justify="center" py={4}>
                    <Spinner />
                </Flex>
            ) : recommendations.length > 0 ? (
                <>
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Imię rekomendowanego</Th>
                                    <Th>Status</Th>
                                    <Th>Data dodania</Th>
                                    <Th>Akcje</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {recommendations.map((recommendation) => (
                                    <Tr key={recommendation.id}>
                                        <Td>{recommendation.recommendedProfileName}</Td>
                                        <Td>{recommendation.status}</Td>
                                        <Td>{new Date(recommendation.createdAt).toLocaleDateString('pl-PL')}</Td>
                                        <Td>
                                            <Button colorScheme="red" size="sm" onClick={() => setDeleteId(recommendation.id)}>
                                                Usuń
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>

                    {/* Paginacja */}
                    {totalPages > 1 && (
                        <Flex justify="center" mt={4}>
                            <HStack>
                                <IconButton
                                    icon={<ChevronLeftIcon />}
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    isDisabled={page === 0}
                                    aria-label="Poprzednia strona"
                                />
                                <Text>
                                    Strona {page + 1} z {totalPages}
                                </Text>
                                <IconButton
                                    icon={<ChevronRightIcon />}
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    isDisabled={page >= totalPages - 1}
                                    aria-label="Następna strona"
                                />
                            </HStack>
                        </Flex>
                    )}
                </>
            ) : (
                <Text>Brak rekomendacji dla tego użytkownika.</Text>
            )}

            <UserSearchModal
                isOpen={isOpen}
                onClose={onClose}
                onSelect={handleAddRecommendation}
                excludeUserId={userId}
            />

            {/* Dialog potwierdzenia usunięcia */}
            <AlertDialog
                isOpen={!!deleteId}
                leastDestructiveRef={cancelRef}
                onClose={() => setDeleteId(null)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Usuń rekomendację
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Czy na pewno chcesz usunąć tę rekomendację?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setDeleteId(null)}>
                                Anuluj
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteRecommendation} ml={3}>
                                Usuń
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default AdminUserRecommendations;
