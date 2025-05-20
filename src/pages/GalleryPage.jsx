// src/pages/GalleryPage.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, Image, Input, VStack, HStack, Text, Spinner, Alert, AlertIcon
} from '@chakra-ui/react';
import {
    fetchUserImages, uploadImage, cropImage, updateOrder
} from '../services/galleryService';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [cropParams, setCropParams] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const [cropImageId, setCropImageId] = useState(null);

    const loadImages = async () => {
        setLoading(true);
        try {
            setImages(await fetchUserImages());
            setError('');
        } catch (e) {
            setError('Błąd ładowania zdjęć');
        }
        setLoading(false);
    };

    useEffect(() => { loadImages(); }, []);

    // Upload zdjęcia
    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            await uploadImage(file);
            setFile(null);
            await loadImages();
        } catch {
            setError('Błąd uploadu');
        }
        setLoading(false);
    };

    // Drag & drop zmiana kolejności
    const handleDragStart = (idx) => setDragIndex(idx);
// Drag & drop zmiana kolejności
    const handleDrop = async (idx) => {
        if (dragIndex === null || dragIndex === idx) return;

        setLoading(true);
        try {
            // Przenosimy element w lokalnej tablicy
            const newImages = [...images];
            const [moved] = newImages.splice(dragIndex, 1);
            newImages.splice(idx, 0, moved);

            // Przygotuj dane w formie zgodnej z DTO na backendzie
            const orderDTO = {
                images: newImages.map((img, i) => ({
                    id: img.id,
                    displayOrder: i
                }))
            };

            // Zaktualizuj stan przed żądaniem API
            setImages(newImages);

            // Wyślij nową kolejność do API
            await updateOrder(orderDTO);
            setError('');
        } catch (e) {
            setError('Błąd podczas zmiany kolejności zdjęć');
            // W razie błędu, odśwież zdjęcia z serwera
            await loadImages();
        } finally {
            setLoading(false);
            setDragIndex(null);
        }
    };

    // Kadrowanie (prosty input)
    const handleCrop = async () => {
        if (!cropImageId) return;
        setLoading(true);
        try {
            await cropImage(cropImageId, cropParams);
            setCropImageId(null);
            await loadImages();
        } catch {
            setError('Błąd kadrowania');
        }
        setLoading(false);
    };

    return (
        <Box maxW="600px" mx="auto" mt={8}>
            <VStack spacing={4}>
                <Text fontWeight="bold">Twoja galeria</Text>
                {loading && <Spinner />}
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}

                {/* Upload */}
                <HStack>
                    <Input type="file" onChange={e => setFile(e.target.files[0])} />
                    <Button onClick={handleUpload} isDisabled={!file}>Wyślij</Button>
                </HStack>

                {/* Lista zdjęć z drag&drop */}
                <VStack spacing={2} align="stretch">
                    {images.map((img, idx) => (
                        <HStack
                            key={img.id}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => handleDrop(idx)}
                            border="1px solid #ccc"
                            borderRadius="md"
                            p={2}
                            bg={img.isMain ? "blue.50" : "white"}
                        >
                            <Image src={img.thumbnailUrl} boxSize="60px" objectFit="cover" />
                            <Text flex="1">ID: {img.id}</Text>
                            <Button size="sm" onClick={() => setCropImageId(img.id)}>
                                Kadruj
                            </Button>
                        </HStack>
                    ))}
                </VStack>

                {/* Kadrowanie */}
                {cropImageId && (
                    <Box border="1px solid #eee" p={3} borderRadius="md">
                        <Text>Kadruj zdjęcie ID: {cropImageId}</Text>
                        <HStack>
                            <Input
                                placeholder="x"
                                type="number"
                                value={cropParams.x}
                                onChange={e => setCropParams({ ...cropParams, x: Number(e.target.value) })}
                                width="60px"
                            />
                            <Input
                                placeholder="y"
                                type="number"
                                value={cropParams.y}
                                onChange={e => setCropParams({ ...cropParams, y: Number(e.target.value) })}
                                width="60px"
                            />
                            <Input
                                placeholder="width"
                                type="number"
                                value={cropParams.width}
                                onChange={e => setCropParams({ ...cropParams, width: Number(e.target.value) })}
                                width="60px"
                            />
                            <Input
                                placeholder="height"
                                type="number"
                                value={cropParams.height}
                                onChange={e => setCropParams({ ...cropParams, height: Number(e.target.value) })}
                                width="60px"
                            />
                            <Button onClick={handleCrop}>Zapisz kadr</Button>
                            <Button onClick={() => setCropImageId(null)} colorScheme="red">Anuluj</Button>
                        </HStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default GalleryPage;