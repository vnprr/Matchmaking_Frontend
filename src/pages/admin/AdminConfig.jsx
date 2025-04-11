// src/pages/admin/AdminConfig.jsx
import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Button,
    useColorModeValue,
    Flex,
    Text,
    Skeleton,
    Stack,
    IconButton,
    Tooltip,
    useToast,
    FormControl,
    FormLabel,
    Textarea,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const AdminConfig = () => {
    const [config, setConfig] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingConfig, setEditingConfig] = useState(null);
    const [editedValue, setEditedValue] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');

    // Pobranie konfiguracji
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/admin/config');
                setConfig(response.data);
            } catch (err) {
                setError('Błąd podczas pobierania konfiguracji');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    // Rozpoczęcie edycji parametru
    const handleEdit = (item) => {
        setEditingConfig(item);
        setEditedValue(item.paramValue);
        setEditedDescription(item.description);
        onOpen();
    };

    // Zapisanie zmian
    const handleSave = async () => {
        if (!editingConfig) return;

        try {
            setSaving(true);
            await api.put(`/api/admin/config/${editingConfig.paramKey}`, {
                paramValue: editedValue,
                description: editedDescription
            });

            // Aktualizacja stanu
            setConfig(config.map(item =>
                item.paramKey === editingConfig.paramKey
                    ? { ...item, paramValue: editedValue, description: editedDescription }
                    : item
            ));

            toast({
                title: 'Zapisano zmiany',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onClose();
        } catch (err) {
            toast({
                title: 'Błąd',
                description: 'Nie udało się zapisać zmian',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    // Formatowanie wartości konfiguracji
    const formatConfigValue = (value, key) => {
        if (key.includes('MAX_COUNT') || key.includes('LIMIT')) {
            return parseInt(value);
        }
        if (value === 'true' || value === 'false') {
            return value === 'true' ? 'Tak' : 'Nie';
        }
        return value;
    };

    return (
        <Container maxW="4xl" py={8}>
            <Heading as="h1" size="xl" mb={6}>Konfiguracja aplikacji</Heading>

            {error && (
                <Alert status="error" mb={6} rounded="md">
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            <Box
                bg={bgColor}
                rounded="xl"
                boxShadow="lg"
                overflow="hidden"
            >
                {loading ? (
                    <Stack p={6}>
                        <Skeleton height="40px" />
                        <Skeleton height="40px" />
                        <Skeleton height="40px" />
                        <Skeleton height="40px" />
                    </Stack>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr bg={useColorModeValue('gray.50', 'gray.700')}>
                                <Th>Parametr</Th>
                                <Th>Wartość</Th>
                                <Th>Opis</Th>
                                <Th width="50px">Akcje</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {config.map((item) => (
                                <Tr key={item.paramKey}>
                                    <Td fontWeight="bold">{item.paramKey}</Td>
                                    <Td>{formatConfigValue(item.paramValue, item.paramKey)}</Td>
                                    <Td>{item.description}</Td>
                                    <Td>
                                        <IconButton
                                            icon={<EditIcon />}
                                            size="sm"
                                            colorScheme="blue"
                                            onClick={() => handleEdit(item)}
                                            aria-label="Edytuj"
                                        />
                                    </Td>
                                </Tr>
                            ))}
                            {config.length === 0 && (
                                <Tr>
                                    <Td colSpan={4} textAlign="center" py={4}>
                                        Brak parametrów konfiguracyjnych
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                )}
            </Box>

            {/* Modal edycji parametru */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edytuj parametr</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {editingConfig && (
                            <Stack spacing={4}>
                                <FormControl>
                                    <FormLabel>Nazwa parametru</FormLabel>
                                    <Input
                                        value={editingConfig.paramKey}
                                        isReadOnly
                                        bg={useColorModeValue('gray.100', 'gray.600')}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Wartość</FormLabel>
                                    <Input
                                        value={editedValue}
                                        onChange={(e) => setEditedValue(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Opis</FormLabel>
                                    <Textarea
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                    />
                                </FormControl>
                            </Stack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Anuluj
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleSave}
                            isLoading={saving}
                        >
                            Zapisz
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default AdminConfig;