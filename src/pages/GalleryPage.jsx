import { useState, useEffect } from 'react';
import { Box, VStack, Text, Spinner, Alert, AlertIcon, Flex, useToast } from '@chakra-ui/react';
import { fetchUserImages, updateOrder, deleteImage } from '../services/galleryService';
import { handleApiError } from '../utils/apiUtils';
import ImageUploader from '../components/gallery/ImageUploader';
import ImageGrid from '../components/gallery/ImageGrid';
import ImagePreview from '../components/gallery/ImagePreview';

const GalleryPage = () => {
    const toast = useToast();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const loadImages = async () => {
        setLoading(true);
        try {
            const imgs = await fetchUserImages();
            setImages(imgs);
            if (imgs.length > 0 && !selectedImage) {
                setSelectedImage(imgs[0]);
            }
        } catch (error) {
            handleApiError(error, setError, toast, 'Error loading images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadImages(); }, []);

    useEffect(() => {
        if (images.length > 0 && (!selectedImage || !images.some(img => img.id === selectedImage.id))) {
            setSelectedImage(images[0]);
        }
    }, [images, selectedImage]);

    const handleOrderChange = async (newImages) => {
        setLoading(true);
        try {
            setImages(newImages);
            await updateOrder({
                images: newImages.map((img, i) => ({ id: img.id, displayOrder: i }))
            });
            toast({
                title: "Images reordered",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            handleApiError(error, setError, toast, 'Error reordering images');
            await loadImages();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (imageId) => {
        setLoading(true);
        try {
            await deleteImage(imageId);
            await loadImages();
            toast({
                title: "Image deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            handleApiError(error, setError, toast, 'Error deleting image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="1000px" mx="auto" mt={8} px={4}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <Text fontSize="2xl" fontWeight="bold">Your Gallery</Text>
                </Flex>
                {loading && <Spinner size="xl" mx="auto" />}
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}
                <ImagePreview image={selectedImage} />
                <ImageUploader onUploadSuccess={loadImages} />
                <ImageGrid 
                    images={images}
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                    onImageDelete={handleDelete}
                    onOrderChange={handleOrderChange}
                />
            </VStack>
        </Box>
    );
};

export default GalleryPage;
