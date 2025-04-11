// src/pages/admin/AdminUsersList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    Box,
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Badge,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    useColorModeValue,
    Text,
    HStack,
    Select,
    ButtonGroup,
    useToast,
    Spinner,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';

const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/admin/users`, {
                params: {
                    search,
                    page,
                    size,
                    sort: `${sortField},${sortDirection}`
                }
            });

            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setError('');
        } catch (err) {
            console.error('Błąd pobierania użytkowników:', err);
            setError('Nie udało się pobrać listy użytkowników.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, sortField, sortDirection]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // Reset strony przy nowym wyszukiwaniu
        fetchUsers();
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleViewUser = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleStatusChange = async (userId, currentStatus) => {
        try {
            await api.put(`/api/admin/users/${userId}/disable`);

            // Aktualizacja statusu użytkownika w lokalnym stanie
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, enabled: !currentStatus }
                    : user
            ));

            toast({
                title: `Użytkownik ${currentStatus ? 'zablokowany' : 'odblokowany'}.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: 'Błąd',
                description: 'Nie udało się zmienić statusu użytkownika.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="6xl" py={8}>
            <Heading as="h1" size="xl" mb={6}>Zarządzanie Użytkownikami</Heading>

            <Flex mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
                <form onSubmit={handleSearch} style={{ width: '100%' }}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Szukaj użytkowników..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button ml={2} type="submit" colorScheme="blue">
                            Szukaj
                        </Button>
                    </InputGroup>
                </form>
            </Flex>

            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            <Box
                bg={bgColor}
                rounded="xl"
                boxShadow="md"
                overflow="hidden"
            >
                {loading ? (
                    <Flex justify="center" align="center" py={10}>
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th onClick={() => handleSort('id')} cursor="pointer">
                                        ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Th>
                                    <Th onClick={() => handleSort('email')} cursor="pointer">
                                        Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Th>
                                    <Th onClick={() => handleSort('firstName')} cursor="pointer">
                                        Imię {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Th>
                                    <Th onClick={() => handleSort('lastName')} cursor="pointer">
                                        Nazwisko {sortField === 'lastName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Th>
                                    <Th>Rola</Th>
                                    <Th>Status</Th>
                                    <Th>Dostawca</Th>
                                    <Th onClick={() => handleSort('createdAt')} cursor="pointer">
                                        Data utworzenia {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Th>
                                    <Th>Akcje</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {users.map(user => (
                                    <Tr key={user.id}>
                                        <Td>{user.id}</Td>
                                        <Td>{user.email}</Td>
                                        <Td>{user.firstName || '-'}</Td>
                                        <Td>{user.lastName || '-'}</Td>
                                        <Td>
                                            <Badge colorScheme={user.role === 'ADMIN' ? 'red' : 'blue'}>
                                                {user.role}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={user.enabled ? 'green' : 'red'}>
                                                {user.enabled ? 'Aktywny' : 'Zablokowany'}
                                            </Badge>
                                        </Td>
                                        <Td>{user.provider}</Td>
                                        <Td>{new Date(user.createdAt).toLocaleDateString('pl-PL')}</Td>
                                        <Td>
                                            <ButtonGroup size="sm" isAttached>
                                                <IconButton
                                                    icon={<ViewIcon />}
                                                    aria-label="Zobacz użytkownika"
                                                    onClick={() => handleViewUser(user.id)}
                                                    colorScheme="blue"
                                                />
                                                <Button
                                                    colorScheme={user.enabled ? "red" : "green"}
                                                    onClick={() => handleStatusChange(user.id, user.enabled)}
                                                >
                                                    {user.enabled ? 'Blokuj' : 'Odblokuj'}
                                                </Button>
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}

                {/* Paginacja */}
                <Flex justify="space-between" align="center" p={4}>
                    <HStack>
                        <Text>Wyświetlaj po:</Text>
                        <Select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            width="70px"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </Select>
                    </HStack>

                    <HStack>
                        <IconButton
                            icon={<ChevronLeftIcon />}
                            onClick={() => setPage(Math.max(0, page - 1))}
                            isDisabled={page === 0}
                            aria-label="Poprzednia strona"
                        />
                        <Text>
                            Strona {page + 1} z {totalPages || 1}
                        </Text>
                        <IconButton
                            icon={<ChevronRightIcon />}
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            isDisabled={page >= totalPages - 1}
                            aria-label="Następna strona"
                        />
                    </HStack>
                </Flex>
            </Box>
        </Container>
    );
};

export default AdminUsersList;