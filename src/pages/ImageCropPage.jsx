import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Spinner,
    Image,
    Text,
    useToast,
    VStack,
    Button,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react';
import { getImageById, cropImage, setAvatarImage } from '../services/galleryService';  // dodane cropImage i setAvatarImage

// Klucze w DTO
const WIDTH_PARAM  = 'originalWidth';
const HEIGHT_PARAM = 'originalHeight';

export default function ImageViewPage() {
    const { imageId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Check if avatar mode is enabled via query parameter
    const isAvatarMode = new URLSearchParams(location.search).get('avatar') === 'true';

    const [image, setImage]     = useState(null);
    const [loading, setLoading] = useState(true);

    // stany kadru
    const [cropWidth, setCropWidth]   = useState(0);
    const [cropHeight, setCropHeight] = useState(0);
    const [cropX, setCropX]           = useState(0);
    const [cropY, setCropY]           = useState(0);

    // For avatar mode - single size control
    const [squareSize, setSquareSize] = useState(0);

    // 1. Pobierz obraz i ustaw stany początkowe
    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true);
            try {
                const imgData = await getImageById(imageId);
                if (!imgData.originalUrl) throw new Error('Brak originalUrl w API');
                setImage(imgData);

                if (isAvatarMode) {
                    // For avatar mode, initialize with a square in the center
                    const minDimension = Math.min(imgData[WIDTH_PARAM], imgData[HEIGHT_PARAM]);
                    const initialSize = Math.floor(minDimension * 0.8); // 80% of the smaller dimension

                    // Center the square
                    const initialX = Math.floor((imgData[WIDTH_PARAM] - initialSize) / 2);
                    const initialY = Math.floor((imgData[HEIGHT_PARAM] - initialSize) / 2);

                    setSquareSize(initialSize);
                    setCropWidth(initialSize);
                    setCropHeight(initialSize);
                    setCropX(initialX);
                    setCropY(initialY);
                } else {
                    // Regular mode - use full image dimensions
                    setCropWidth(imgData[WIDTH_PARAM]);
                    setCropHeight(imgData[HEIGHT_PARAM]);
                    setCropX(0);
                    setCropY(0);
                }
            } catch (err) {
                console.error(err);
                toast({ status: 'error', title: 'Nie udało się załadować obrazu' });
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [imageId, toast, isAvatarMode]);

    // Avatar mode - maintain square aspect ratio and update width/height when squareSize changes
    useEffect(() => {
        if (!image || !isAvatarMode) return;

        // Calculate maximum possible square size based on current position
        const maxSizeX = image[WIDTH_PARAM] - cropX;
        const maxSizeY = image[HEIGHT_PARAM] - cropY;
        const maxPossibleSize = Math.min(maxSizeX, maxSizeY);

        // Ensure square size doesn't exceed image boundaries
        if (squareSize > maxPossibleSize) {
            setSquareSize(maxPossibleSize);
        }

        // Update width and height to match square size
        setCropWidth(squareSize);
        setCropHeight(squareSize);
    }, [squareSize, cropX, cropY, image, isAvatarMode]);

    // 2. Wzajemne ograniczenia dla osi X
    useEffect(() => {
        if (!image) return;
        const maxW = image[WIDTH_PARAM] - cropX;
        if (cropWidth > maxW) {
            if (isAvatarMode) {
                // In avatar mode, adjust both width and height to maintain square
                setSquareSize(maxW);
            } else {
                setCropWidth(maxW);
            }
        }
    }, [cropX, image, cropWidth, isAvatarMode]);

    useEffect(() => {
        if (!image) return;
        const maxX = image[WIDTH_PARAM] - cropWidth;
        if (cropX > maxX) setCropX(maxX);
    }, [cropWidth, image, cropX]);

    // 3. Wzajemne ograniczenia dla osi Y
    useEffect(() => {
        if (!image) return;
        const maxH = image[HEIGHT_PARAM] - cropY;
        if (cropHeight > maxH) {
            if (isAvatarMode) {
                // In avatar mode, adjust both width and height to maintain square
                setSquareSize(maxH);
            } else {
                setCropHeight(maxH);
            }
        }
    }, [cropY, image, cropHeight, isAvatarMode]);

    useEffect(() => {
        if (!image) return;
        const maxY = image[HEIGHT_PARAM] - cropHeight;
        if (cropY > maxY) setCropY(maxY);
    }, [cropHeight, image, cropY]);

    // 4. Funkcja zapisująca kadrowanie
    const handleSave = async () => {
        setLoading(true);
        try {
            const cropData = {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight
            };

            if (isAvatarMode) {
                // Validate that width and height are identical for avatar mode
                if (cropWidth !== cropHeight) {
                    throw new Error('Kadrowanie avatara musi być kwadratowe (szerokość = wysokość)');
                }

                // Use avatar endpoint for avatar mode
                await setAvatarImage(image.id, cropData);
                toast({ status: 'success', title: 'Avatar został zaktualizowany' });
            } else {
                // Use regular crop endpoint for normal mode
                await cropImage(image.id, cropData);
                toast({ status: 'success', title: 'Kadrowanie zapisane' });
            }
            navigate('/gallery');
        } catch (err) {
            console.error('Error saving crop:', err);

            // Get detailed error message if available
            const errorDetail = err.response?.data?.message || err.message;

            toast({
                status: 'error',
                title: isAvatarMode ? 'Błąd zapisywania avatara' : 'Błąd zapisywania kadru',
                description: errorDetail,
                duration: 6000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="300px">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!image) {
        return (
            <Text textAlign="center" color="red.500">
                Nie znaleziono obrazu do wyświetlenia
            </Text>
        );
    }

    // procentowe wartości dla overlay
    const pctX      = (cropX / image[WIDTH_PARAM]) * 100;
    const pctY      = (cropY / image[HEIGHT_PARAM]) * 100;
    const pctWidth  = (cropWidth / image[WIDTH_PARAM]) * 100;
    const pctHeight = (cropHeight / image[HEIGHT_PARAM]) * 100;

    return (
        <Box maxW="800px" mx="auto" mt={10} px={4}>
            <Button mb={4} variant="outline" onClick={() => navigate('/gallery')}>
                ← Wróć do galerii
            </Button>

            <VStack spacing={6} align="stretch">
                {isAvatarMode && (
                    <Text fontSize="md" fontWeight="bold" color="purple.500" textAlign="center">
                        Tryb avatara - kadrowanie do kwadratu
                    </Text>
                )}
                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Oryginalny rozmiar: {image[WIDTH_PARAM]} × {image[HEIGHT_PARAM]} px
                </Text>

                {/* Suwaki */}
                {isAvatarMode ? (
                    // Avatar mode - single size slider for square crop
                    <Box>
                        <Text mb={1}>Wielkość kadru: {squareSize} px</Text>
                        <Slider
                            min={1}
                            max={Math.min(image[WIDTH_PARAM] - cropX, image[HEIGHT_PARAM] - cropY)}
                            value={squareSize}
                            onChange={setSquareSize}
                        >
                            <SliderTrack><SliderFilledTrack/></SliderTrack>
                            <SliderThumb boxSize={4}/>
                        </Slider>
                    </Box>
                ) : (
                    // Regular mode - separate width and height sliders
                    <>
                        <Box>
                            <Text mb={1}>Szerokość kadru: {cropWidth} px</Text>
                            <Slider
                                min={1}
                                max={image[WIDTH_PARAM] - cropX}
                                value={cropWidth}
                                onChange={setCropWidth}
                            >
                                <SliderTrack><SliderFilledTrack/></SliderTrack>
                                <SliderThumb boxSize={4}/>
                            </Slider>
                        </Box>

                        <Box>
                            <Text mb={1}>Wysokość kadru: {cropHeight} px</Text>
                            <Slider
                                min={1}
                                max={image[HEIGHT_PARAM] - cropY}
                                value={cropHeight}
                                onChange={setCropHeight}
                            >
                                <SliderTrack><SliderFilledTrack/></SliderTrack>
                                <SliderThumb boxSize={4}/>
                            </Slider>
                        </Box>
                    </>
                )}

                <Box>
                    <Text mb={1}>Pozycja X: {cropX} px</Text>
                    <Slider
                        min={0}
                        max={image[WIDTH_PARAM] - cropWidth}
                        value={cropX}
                        onChange={setCropX}
                    >
                        <SliderTrack><SliderFilledTrack/></SliderTrack>
                        <SliderThumb boxSize={4}/>
                    </Slider>
                </Box>

                <Box>
                    <Text mb={1}>Pozycja Y: {cropY} px</Text>
                    <Slider
                        min={0}
                        max={image[HEIGHT_PARAM] - cropHeight}
                        value={cropY}
                        onChange={setCropY}
                    >
                        <SliderTrack><SliderFilledTrack/></SliderTrack>
                        <SliderThumb boxSize={4}/>
                    </Slider>
                </Box>

                {/* Podgląd obrazka z ramką */}
                <Box position="relative" width="100%" overflow="hidden">
                    <Image
                        src={image.originalUrl}
                        alt="Załadowany obraz"
                        width="100%"
                        height="auto"
                        display="block"
                    />
                    <Box
                        position="absolute"
                        top={`${pctY}%`}
                        left={`${pctX}%`}
                        width={`${pctWidth}%`}
                        height={`${pctHeight}%`}
                        border="2px dashed red"
                        pointerEvents="none"
                    />
                </Box>

                {/* Akcja zapisu */}
                <Box textAlign="center" mt={4}>
                    <Button
                        colorScheme="blue"
                        onClick={handleSave}
                        isLoading={loading}
                    >
                        Zapisz kadrowanie
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
}
