import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { getImageById, cropImage } from '../services/galleryService';  // dodane cropImage

// Klucze w DTO
const WIDTH_PARAM  = 'originalWidth';
const HEIGHT_PARAM = 'originalHeight';

export default function ImageViewPage() {
    const { imageId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [image, setImage]     = useState(null);
    const [loading, setLoading] = useState(true);

    // stany kadru
    const [cropWidth, setCropWidth]   = useState(0);
    const [cropHeight, setCropHeight] = useState(0);
    const [cropX, setCropX]           = useState(0);
    const [cropY, setCropY]           = useState(0);

    // 1. Pobierz obraz i ustaw stany początkowe
    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true);
            try {
                const imgData = await getImageById(imageId);
                if (!imgData.originalUrl) throw new Error('Brak originalUrl w API');
                setImage(imgData);
                setCropWidth(imgData[WIDTH_PARAM]);
                setCropHeight(imgData[HEIGHT_PARAM]);
                setCropX(0);
                setCropY(0);
            } catch (err) {
                console.error(err);
                toast({ status: 'error', title: 'Nie udało się załadować obrazu' });
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [imageId, toast]);

    // 2. Wzajemne ograniczenia dla osi X
    useEffect(() => {
        if (!image) return;
        const maxW = image[WIDTH_PARAM] - cropX;
        if (cropWidth > maxW) setCropWidth(maxW);
    }, [cropX, image, cropWidth]);

    useEffect(() => {
        if (!image) return;
        const maxX = image[WIDTH_PARAM] - cropWidth;
        if (cropX > maxX) setCropX(maxX);
    }, [cropWidth, image, cropX]);

    // 3. Wzajemne ograniczenia dla osi Y
    useEffect(() => {
        if (!image) return;
        const maxH = image[HEIGHT_PARAM] - cropY;
        if (cropHeight > maxH) setCropHeight(maxH);
    }, [cropY, image, cropHeight]);

    useEffect(() => {
        if (!image) return;
        const maxY = image[HEIGHT_PARAM] - cropHeight;
        if (cropY > maxY) setCropY(maxY);
    }, [cropHeight, image, cropY]);

    // 4. Funkcja zapisująca kadrowanie
    const handleSave = async () => {
        setLoading(true);
        try {
            await cropImage(image.id, {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight
            });
            toast({ status: 'success', title: 'Kadrowanie zapisane' });
            navigate('/gallery');
        } catch (err) {
            console.error(err);
            toast({
                status: 'error',
                title: 'Błąd zapisywania kadru',
                description: err.message
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
                <Text fontSize="sm" color="gray.600" textAlign="center">
                    Oryginalny rozmiar: {image[WIDTH_PARAM]} × {image[HEIGHT_PARAM]} px
                </Text>

                {/* Suwaki */}
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
