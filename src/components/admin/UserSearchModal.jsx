// src/components/admin/UserSearchModal.jsx
import { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Table, Thead, Tbody, Tr, Th, Td, Avatar, Spinner,
    InputGroup, InputLeftElement, Flex, Box, Text
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const UserSearchModal = ({ isOpen, onClose, onSelect, excludeUserId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/users', {
                params: {
                    search,
                    page,
                    size: 10
                }
            });
            // Filtrujemy wykluczony ID użytkownika
            const filteredUsers = response.data.content.filter(user => user.id !== excludeUserId);
            setUsers(filteredUsers);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchUsers();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Wybierz użytkownika do rekomendacji</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSearch}>
                        <InputGroup mb={4}>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Szukaj użytkownika..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button ml={2} type="submit" colorScheme="blue">
                                Szukaj
                            </Button>
                        </InputGroup>
                    </form>

                    {loading ? (
                        <Flex justify="center" py={4}>
                            <Spinner />
                        </Flex>
                    ) : users.length > 0 ? (
                        <Box overflowY="auto" maxH="400px">
                            <Table variant="simple">
                                <Thead position="sticky" top={0} bg="white" zIndex={1}>
                                    <Tr>
                                        <Th>Zdjęcie</Th>
                                        <Th>Imię i nazwisko</Th>
                                        <Th>Email</Th>
                                        <Th>Akcja</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map((user) => (
                                        <Tr key={user.id}>
                                            <Td>
                                                <Avatar
                                                    name={`${user.firstName || ''} ${user.lastName || ''}`}
                                                    size="sm"
                                                />
                                            </Td>
                                            <Td>
                                                {user.firstName || ''} {user.lastName || ''}
                                                {!user.firstName && !user.lastName && <Text color="gray.500">Brak danych</Text>}
                                            </Td>
                                            <Td>{user.email}</Td>
                                            <Td>
                                                <Button
                                                    size="sm"
                                                    colorScheme="blue"
                                                    onClick={() => onSelect(user.id)}
                                                >
                                                    Wybierz
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    ) : (
                        <Text>Nie znaleziono użytkowników.</Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Anuluj</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UserSearchModal;