// src/components/profile/ProfileImages.jsx
import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Flex,
    Grid,
    Image,
    Text,
    IconButton,
    Spinner,
    useToast,
    useColorModeValue,
    Heading,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon, StarIcon, AddIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const ProfileImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    const fileInputRef = useRef(null);
    const cancelRef = useRef(null);
    const toast = useToast();

    // Pobranie zdjęć po załadowaniu komponentu
    useEffect(() => {
        fetchImages();
    }, []);

    // Pobieranie zdjęć z API
    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/profile/images');
            setImages(response.data || []);
        } catch (err) {
            console.error('Błąd pobierania zdjęć:', err);
            setError('Nie udało się pobrać zdjęć');
        } finally {
            setLoading(false);
        }
    };

    // Obsługa uploadu zdjęcia
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Walidacja typu pliku
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Nieprawidłowy format pliku',
                description: 'Proszę wybrać plik graficzny',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Walidacja rozmiaru pliku (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'Plik jest za duży',
                description: 'Maksymalny rozmiar pliku to 5MB',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            setUploading(true);
            setError('');

            const formData = new FormData();
            formData.append('file', file);

            await api.post('/api/profile/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Ponowne pobranie zdjęć po udanym uploadzie
            await fetchImages();

            toast({
                title: 'Zdjęcie zostało dodane',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Błąd podczas uploadu:', err);
            setError('Nie udało się dodać zdjęcia');
        } finally {
            setUploading(false);
            // Resetowanie pola input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Ustawienie zdjęcia jako główne
    const setMainImage = async (imageId) => {
        try {
            await api.put(`/api/profile/images/${imageId}/main`);

            // Aktualizacja lokalnego stanu
            setImages(images.map(img => ({
                ...img,
                main: img.id === imageId
            })));

            toast({
                title: 'Zdjęcie profilowe zostało zmienione',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Błąd podczas zmiany zdjęcia głównego:', err);
            toast({
                title: 'Błąd',
                description: 'Nie udało się zmienić zdjęcia profilowego',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Otwarcie dialogu potwierdzenia usunięcia
    const openDeleteDialog = (image) => {
        setImageToDelete(image);
        setIsDeleteDialogOpen(true);
    };

    // Usunięcie zdjęcia
    const deleteImage = async () => {
        if (!imageToDelete) return;

        try {
            await api.delete(`/api/profile/images/${imageToDelete.id}`);

            // Usunięcie z lokalnego stanu
            setImages(images.filter(img => img.id !== imageToDelete.id));

            toast({
                title: 'Zdjęcie zostało usunięte',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Błąd podczas usuwania zdjęcia:', err);
            toast({
                title: 'Błąd',
                description: 'Nie udało się usunąć zdjęcia',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setImageToDelete(null);
        }
    };

    return (
        <Box width="100%">
            <Heading as="h3" size="md" mb={4}>
                Zdjęcia profilowe
            </Heading>

            {error && (
                <Alert status="error" mb={4} rounded="md">
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {/* Przycisk dodawania zdjęcia */}
            <Box mb={4}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={uploading}
                    isDisabled={uploading || loading}
                >
                    Dodaj zdjęcie
                </Button>
            </Box>

            {loading ? (
                <Flex justify="center" my={6}>
                    <Spinner size="lg" />
                </Flex>
            ) : (
                <>
                    {images.length === 0 ? (
                        <Text color="gray.500" fontStyle="italic">
                            Brak zdjęć profilowych
                        </Text>
                    ) : (
                        <Grid
                            templateColumns={{
                                base: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)"
                            }}
                            gap={4}
                        >
                            {images.map((image) => (
                                <Box
                                    key={image.id}
                                    position="relative"
                                    borderWidth={image.main ? "3px" : "1px"}
                                    borderColor={image.main ? "blue.400" : "gray.200"}
                                    borderRadius="md"
                                    overflow="hidden"
                                >
                                    <Image
                                        src={image.imageUrl}
                                        alt="Zdjęcie profilowe"
                                        objectFit="cover"
                                        boxSize="150px"
                                    />
                                    <Flex
                                        position="absolute"
                                        bottom="0"
                                        left="0"
                                        right="0"
                                        bg="blackAlpha.600"
                                        p={1}
                                        justifyContent="space-between"
                                    >
                                        <IconButton
                                            icon={<StarIcon />}
                                            size="sm"
                                            colorScheme={image.main ? "yellow" : "gray"}
                                            aria-label="Ustaw jako główne"
                                            isDisabled={image.main}
                                            onClick={() => setMainImage(image.id)}
                                        />
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            size="sm"
                                            colorScheme="red"
                                            aria-label="Usuń zdjęcie"
                                            onClick={() => openDeleteDialog(image)}
                                        />
                                    </Flex>
                                </Box>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {/* Dialog potwierdzenia usunięcia */}
            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            Usuń zdjęcie
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Czy na pewno chcesz usunąć to zdjęcie? Tej operacji nie można cofnąć.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                                Anuluj
                            </Button>
                            <Button colorScheme="red" onClick={deleteImage} ml={3}>
                                Usuń
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default ProfileImages;