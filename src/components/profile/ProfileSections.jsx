// src/components/profile/ProfileSections.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    Spinner,
    useToast,
    useColorModeValue,
    Heading,
    Alert,
    AlertIcon,
    Stack,
    Textarea,
} from '@chakra-ui/react';
import { EditIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const ProfileSections = () => {
    const [profileSections, setProfileSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [savingSectionId, setSavingSectionId] = useState(null);

    const toast = useToast();

    // Pobieranie sekcji profilu
    useEffect(() => {
        const fetchProfileSections = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await api.get('/api/profile/sections');
                setProfileSections(response.data || []);
            } catch (err) {
                console.error('Błąd pobierania sekcji profilu:', err);
                setError('Nie udało się pobrać sekcji profilu');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileSections();
    }, []);

    // Włączenie trybu edycji dla sekcji
    const handleEditSection = (section) => {
        setEditingSectionId(section.sectionId);
        setEditedContent(section.content || '');
    };

    // Anulowanie edycji sekcji
    const handleCancelEdit = () => {
        setEditingSectionId(null);
        setEditedContent('');
    };

    // Zapisanie zmian w sekcji
    const handleSaveSection = async (sectionId) => {
        try {
            setSavingSectionId(sectionId);

            // Wywołanie API do aktualizacji sekcji
            await api.put(`/api/profile/sections/${sectionId}`, editedContent, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            // Aktualizacja lokalnego stanu
            setProfileSections(prevSections =>
                prevSections.map(section =>
                    section.sectionId === sectionId
                        ? { ...section, content: editedContent }
                        : section
                )
            );

            toast({
                title: 'Sekcja zaktualizowana',
                status: 'success',
                duration: 3000,
                isClosable: true
            });

            setEditingSectionId(null);
            setEditedContent('');
        } catch (error) {
            console.error('Błąd podczas zapisywania sekcji:', error);
            toast({
                title: 'Błąd',
                description: 'Nie udało się zapisać zmian',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setSavingSectionId(null);
        }
    };

    if (loading) {
        return (
            <Box width="100%" textAlign="center" py={6}>
                <Spinner size="lg" />
            </Box>
        );
    }

    return (
        <Box width="100%">
            <Heading as="h3" size="md" mb={4}>
                O mnie
            </Heading>

            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {profileSections.length === 0 ? (
                <Text color="gray.500" fontStyle="italic">
                    Brak dodatkowych informacji
                </Text>
            ) : (
                <Stack spacing={5}>
                    {profileSections.map((section) => (
                        <Box key={section.sectionId}>
                            <Flex align="center" justify="space-between" mb={2}>
                                <Text fontWeight="bold">
                                    {section.sectionName}
                                    {section.required && (
                                        <Text as="span" color="red.500" ml={1}>*</Text>
                                    )}
                                </Text>

                                {editingSectionId !== section.sectionId && (
                                    <Button
                                        size="sm"
                                        leftIcon={<EditIcon />}
                                        onClick={() => handleEditSection(section)}
                                    >
                                        Edytuj
                                    </Button>
                                )}
                            </Flex>

                            {editingSectionId === section.sectionId ? (
                                <Box>
                                    <Textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        mb={2}
                                    />
                                    <Flex justify="flex-end">
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            leftIcon={<CloseIcon />}
                                            mr={2}
                                            onClick={handleCancelEdit}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            size="sm"
                                            colorScheme="green"
                                            leftIcon={<CheckIcon />}
                                            isLoading={savingSectionId === section.sectionId}
                                            onClick={() => handleSaveSection(section.sectionId)}
                                        >
                                            Zapisz
                                        </Button>
                                    </Flex>
                                </Box>
                            ) : (
                                <Box
                                    p={3}
                                    bg={useColorModeValue('gray.50', 'gray.600')}
                                    borderRadius="md"
                                >
                                    {section.content ? (
                                        <Text>{section.content}</Text>
                                    ) : (
                                        <Text color="gray.500" fontStyle="italic">
                                            Brak informacji
                                        </Text>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default ProfileSections;