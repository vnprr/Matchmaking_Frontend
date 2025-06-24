import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Spinner, Image, Text, useToast, VStack, Button, 
    Alert, AlertIcon, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
} from '@chakra-ui/react';
import { getImageById, cropImage, setAvatarImage } from '../services/galleryService';
import { handleApiError } from '../utils/apiUtils';

const WIDTH_PARAM = 'originalWidth';
const HEIGHT_PARAM = 'originalHeight';

export default function ImageCropPage() {
    const { imageId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const isAvatarMode = new URLSearchParams(useLocation().search).get('avatar') === 'true';

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cropParams, setCropParams] = useState({ x: 0, y: 0, width: 100, height: 100 });

    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true);
            try {
                const imgData = await getImageById(imageId);
                setImage(imgData);

                const minDimension = Math.min(imgData[WIDTH_PARAM], imgData[HEIGHT_PARAM]);
                const initialSize = isAvatarMode 
                    ? Math.floor(minDimension * 0.8) 
                    : Math.floor(imgData[WIDTH_PARAM] * 0.5);

                const initialX = Math.floor((imgData[WIDTH_PARAM] - initialSize) / 2);
                const initialY = Math.floor((imgData[HEIGHT_PARAM] - (isAvatarMode ? initialSize : Math.floor(imgData[HEIGHT_PARAM] * 0.5))) / 2);

                setCropParams({
                    x: initialX,
                    y: initialY,
                    width: initialSize,
                    height: isAvatarMode ? initialSize : Math.floor(imgData[HEIGHT_PARAM] * 0.5)
                });
            } catch (error) {
                handleApiError(error, setError, toast, 'Failed to load image');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [imageId, toast, isAvatarMode]);

    const updateCropParam = (param, value) => {
        const numValue = Number(value);
        if (isNaN(numValue)) return;

        setCropParams(prev => ({
            ...prev,
            [param]: numValue,
            ...(isAvatarMode && (param === 'width' || param === 'height') ? { width: numValue, height: numValue } : {})
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (isAvatarMode) {
                const squareSize = Math.min(cropParams.width, cropParams.height);
                const squareCrop = { ...cropParams, width: squareSize, height: squareSize };
                await setAvatarImage(image.id, squareCrop);
            } else {
                await cropImage(image.id, cropParams);
            }

            toast({ 
                status: 'success', 
                title: isAvatarMode ? 'Avatar updated successfully' : 'Image cropped successfully',
                duration: 3000,
                isClosable: true
            });
            navigate('/gallery');
        } catch (error) {
            handleApiError(error, setError, toast, 
                isAvatarMode ? 'Failed to save avatar' : 'Failed to crop image'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading && !image) return <Box display="flex" justifyContent="center" alignItems="center" h="300px"><Spinner size="xl" /></Box>;
    if (!image) return <Text textAlign="center" color="red.500">Image not found</Text>;

    const pctX = (cropParams.x / image[WIDTH_PARAM]) * 100;
    const pctY = (cropParams.y / image[HEIGHT_PARAM]) * 100;
    const pctWidth = (cropParams.width / image[WIDTH_PARAM]) * 100;
    const pctHeight = (cropParams.height / image[HEIGHT_PARAM]) * 100;

    return (
        <Box maxW="800px" mx="auto" mt={10} px={4}>
            <Button mb={4} variant="outline" onClick={() => navigate('/gallery')}>← Back to Gallery</Button>

            <VStack spacing={6} align="stretch">
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}
                {isAvatarMode && <Text fontSize="md" fontWeight="bold" color="purple.500" textAlign="center">Avatar Mode - Square Cropping</Text>}
                <Text fontSize="sm" color="gray.600" textAlign="center">Original size: {image[WIDTH_PARAM]} × {image[HEIGHT_PARAM]} px</Text>

                <Box border="1px solid #eee" p={3} borderRadius="md">
                    <Text mb={2}>Crop Parameters:</Text>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Text fontSize="xs" mb={1}>X: {cropParams.x}</Text>
                            <Slider
                                min={0}
                                max={image[WIDTH_PARAM] - cropParams.width}
                                value={cropParams.x}
                                onChange={(value) => updateCropParam('x', value)}
                                size="sm"
                            >
                                <SliderTrack><SliderFilledTrack /></SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        <Box>
                            <Text fontSize="xs" mb={1}>Y: {cropParams.y}</Text>
                            <Slider
                                min={0}
                                max={image[HEIGHT_PARAM] - cropParams.height}
                                value={cropParams.y}
                                onChange={(value) => updateCropParam('y', value)}
                                size="sm"
                            >
                                <SliderTrack><SliderFilledTrack /></SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        {isAvatarMode ? (
                            <Box>
                                <Text fontSize="xs" mb={1}>Size: {cropParams.width}</Text>
                                <Slider
                                    min={10}
                                    max={Math.min(image[WIDTH_PARAM] - cropParams.x, image[HEIGHT_PARAM] - cropParams.y)}
                                    value={cropParams.width}
                                    onChange={(value) => updateCropParam('width', value)}
                                    size="sm"
                                >
                                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>
                        ) : (
                            <>
                                <Box>
                                    <Text fontSize="xs" mb={1}>Width: {cropParams.width}</Text>
                                    <Slider
                                        min={10}
                                        max={image[WIDTH_PARAM] - cropParams.x}
                                        value={cropParams.width}
                                        onChange={(value) => updateCropParam('width', value)}
                                        size="sm"
                                    >
                                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Box>
                                <Box>
                                    <Text fontSize="xs" mb={1}>Height: {cropParams.height}</Text>
                                    <Slider
                                        min={10}
                                        max={image[HEIGHT_PARAM] - cropParams.y}
                                        value={cropParams.height}
                                        onChange={(value) => updateCropParam('height', value)}
                                        size="sm"
                                    >
                                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Box>
                            </>
                        )}
                    </VStack>
                </Box>

                <Box position="relative" width="100%" overflow="hidden">
                    <Image src={image.originalUrl} alt="Original image" width="100%" height="auto" display="block" />
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

                <Button
                    colorScheme={isAvatarMode ? "purple" : "blue"}
                    onClick={handleSave}
                    isLoading={loading}
                    size="lg"
                    mt={4}
                >
                    {isAvatarMode ? 'Save as Avatar' : 'Save Crop'}
                </Button>
            </VStack>
        </Box>
    );
}
