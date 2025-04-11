// src/pages/admin/AdminProfileSections.jsx
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
    Button,
    useColorModeValue,
    Flex,
    Spinner,
    IconButton,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Switch,
    Textarea,
    Select,
    Alert,
    AlertIcon,
    HStack
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const AdminProfileSections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentSection, setCurrentSection] = useState(null);
    const [saving, setSaving] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');

    // Pobranie wszystkich sekcji
    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/profile-sections');
            setSections(response.data);
        } catch (err) {
            setError('Błąd podczas pobierania sekcji profilu');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Obsługa formularza
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            if (currentSection.id) {
                // Aktualizacja istniejącej sekcji
                await api.put(`/api/admin/profile-sections/${currentSection.id}`, {
                    name: currentSection.name,
                    code: currentSection.code,
                    description: currentSection.description,
                    type: currentSection.type,
                    required: currentSection.required,
                    active: currentSection.active
                });

                toast({
                    title: 'Sekcja zaktualizowana',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
            } else {
                // Tworzenie nowej sekcji
                await api.post('/api/admin/profile-sections', {
                    name: currentSection.name,
                    code: currentSection.code,
                    description: currentSection.description,
                    type: currentSection.type,
                    required: currentSection.required,
                    active: currentSection.active
                });

                toast({
                    title: 'Sekcja utworzona',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
            }

            // Odśwież listę sekcji
            fetchSections();
            onClose();
        } catch (err) {
            toast({
                title: 'Błąd',
                description: 'Nie udało się zapisać sekcji',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setSaving(false);
        }
    };

    // Otwórz modal do tworzenia nowej sekcji
    const handleAddNew = () => {
        setCurrentSection({
            name: '',
            code: '',
            description: '',
            type: 'TEXT',
            required: false,
            active: true
        });
        onOpen();
    };

    // Otwórz modal do edycji istniejącej sekcji
    const handleEdit = (section) => {
        setCurrentSection({ ...section });
        onOpen();
    };

    // Usuń sekcję
    const handleDelete = async (id) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tę sekcję? Ta operacja jest nieodwracalna.')) {
            return;
        }

        try {
            await api.delete(`/api/admin/profile-sections/${id}`);

            toast({
                title: 'Sekcja usunięta',
                status: 'success',
                duration: 3000,
                isClosable: true
            });

            fetchSections();
        } catch (err) {
            toast({
                title: 'Błąd',
                description: 'Nie udało się usunąć sekcji',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    // Przesuń sekcję w górę
    const handleMoveUp = async (id) => {
        try {
            await api.put(`/api/admin/profile-sections/${id}/move-up`);
            fetchSections();
        } catch (err) {
            toast({
                title: 'Błąd',
                description: 'Nie można przesunąć sekcji wyżej',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };

    // Przesuń sekcję w dół
    const handleMoveDown = async (id) => {
        try {
            await api.put(`/api/admin/profile-sections/${id}/move-down`);
            fetchSections();
        } catch (err) {
            toast({
                title: 'Błąd',
                description: 'Nie można przesunąć sekcji niżej',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };

    // Obsługa zmiany pól formularza
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentSection({
            ...currentSection,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <Container maxW="4xl" py={8}>
            <Heading as="h1" size="xl" mb={6}>Zarządzanie sekcjami profilu</Heading>

            <Flex justify="flex-end" mb={4}>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={handleAddNew}
                >
                    Dodaj nową sekcję
                </Button>
            </Flex>

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
                    <Flex justify="center" p={6}>
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr bg={useColorModeValue('gray.50', 'gray.700')}>
                                <Th>LP.</Th>
                                <Th>Nazwa</Th>
                                <Th>Kod</Th>
                                <Th>Typ</Th>
                                <Th>Wymagane</Th>
                                <Th>Status</Th>
                                <Th width="180px">Akcje</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sections.length > 0 ? (
                                sections.map((section, index) => (
                                    <Tr key={section.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{section.name}</Td>
                                        <Td>{section.code}</Td>
                                        <Td>{section.type}</Td>
                                        <Td>{section.required ? 'Tak' : 'Nie'}</Td>
                                        <Td>{section.active ? 'Aktywna' : 'Nieaktywna'}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    icon={<ArrowUpIcon />}
                                                    size="sm"
                                                    aria-label="Przesuń w górę"
                                                    onClick={() => handleMoveUp(section.id)}
                                                    isDisabled={index === 0}
                                                />
                                                <IconButton
                                                    icon={<ArrowDownIcon />}
                                                    size="sm"
                                                    aria-label="Przesuń w dół"
                                                    onClick={() => handleMoveDown(section.id)}
                                                    isDisabled={index === sections.length - 1}
                                                />
                                                <IconButton
                                                    icon={<EditIcon />}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    aria-label="Edytuj"
                                                    onClick={() => handleEdit(section)}
                                                />
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    aria-label="Usuń"
                                                    onClick={() => handleDelete(section.id)}
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={7} textAlign="center" py={4}>
                                        Brak zdefiniowanych sekcji profilu
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                )}
            </Box>

            {/* Modal do dodawania/edycji sekcji */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {currentSection?.id ? 'Edytuj sekcję profilu' : 'Dodaj nową sekcję profilu'}
                    </ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleFormSubmit}>
                        <ModalBody>
                            <FormControl mb={4} isRequired>
                                <FormLabel>Nazwa sekcji</FormLabel>
                                <Input
                                    name="name"
                                    value={currentSection?.name || ''}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl mb={4} isRequired>
                                <FormLabel>Kod sekcji</FormLabel>
                                <Input
                                    name="code"
                                    value={currentSection?.code || ''}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Opis</FormLabel>
                                <Textarea
                                    name="description"
                                    value={currentSection?.description || ''}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl mb={4} isRequired>
                                <FormLabel>Typ sekcji</FormLabel>
                                <Select
                                    name="type"
                                    value={currentSection?.type || 'TEXT'}
                                    onChange={handleInputChange}
                                >
                                    <option value="TEXT">Tekst</option>
                                    <option value="TEXTAREA">Obszar tekstowy</option>
                                    <option value="NUMBER">Liczba</option>
                                    <option value="DATE">Data</option>
                                    <option value="SELECT">Lista wyboru</option>
                                    <option value="CHECKBOX">Pole wyboru</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={4} display="flex" alignItems="center">
                                <FormLabel mb="0">Wymagane</FormLabel>
                                <Switch
                                    name="required"
                                    isChecked={currentSection?.required}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl mb={4} display="flex" alignItems="center">
                                <FormLabel mb="0">Aktywna</FormLabel>
                                <Switch
                                    name="active"
                                    isChecked={currentSection?.active}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Anuluj
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={saving}
                            >
                                {currentSection?.id ? 'Zapisz zmiany' : 'Dodaj sekcję'}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default AdminProfileSections;