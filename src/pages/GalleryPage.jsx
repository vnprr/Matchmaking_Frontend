// src/pages/GalleryPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Image, Input, VStack, HStack, Text, Spinner, Alert, AlertIcon,
    Grid, GridItem, Flex, IconButton, useToast, Badge
} from '@chakra-ui/react';
import {
    fetchUserImages, uploadImage, cropImage, updateOrder, deleteImage, fetchUserAvatar
} from '../services/galleryService';

const GalleryPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [images, setImages] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Load images and avatar
    const loadImages = async () => {
        setLoading(true);
        try {
            // Load all user images
            const imgs = await fetchUserImages();
            setImages(imgs);

            // Load user avatar
            try {
                const avatarData = await fetchUserAvatar();
                setAvatar(avatarData);
            } catch (avatarError) {
                console.log('No avatar set or error fetching avatar');
            }

            // Set first image as selected by default
            if (imgs.length > 0 && !selectedImage) {
                setSelectedImage(imgs[0]);
            }

            setError('');
        } catch (error) {
            console.error('Error loading images:', error);
            setError('Error loading images');
        }
        setLoading(false);
    };

    useEffect(() => { loadImages(); }, []);

    // Update selected image when gallery changes
    useEffect(() => {
        if (images.length > 0 && !selectedImage) {
            setSelectedImage(images[0]);
        } else if (selectedImage) {
            // Check if selected image still exists after deletion
            const stillExists = images.some(img => img.id === selectedImage.id);
            if (!stillExists && images.length > 0) {
                setSelectedImage(images[0]);
            }
        }
    }, [images, selectedImage]);

    // Upload new image
    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            await uploadImage(file);
            setFile(null);
            await loadImages();
            toast({
                title: "Image uploaded",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Upload error:', error);
            setError('Upload failed');
            toast({
                title: "Upload failed",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    // Drag & drop reordering
    const handleDragStart = (idx) => setDragIndex(idx);

    const handleDrop = async (idx) => {
        if (dragIndex === null || dragIndex === idx) return;

        setLoading(true);
        try {
            // Move element in local array
            const newImages = [...images];
            const [moved] = newImages.splice(dragIndex, 1);
            newImages.splice(idx, 0, moved);

            // Prepare data in format matching backend DTO
            const orderDTO = {
                images: newImages.map((img, i) => ({
                    id: img.id,
                    displayOrder: i
                }))
            };

            // Update state before API request
            setImages(newImages);

            // Send new order to API
            await updateOrder(orderDTO);
            setError('');
            toast({
                title: "Images reordered",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error reordering images:', error);
            setError('Error reordering images');
            // Refresh images from server in case of error
            await loadImages();
        } finally {
            setLoading(false);
            setDragIndex(null);
        }
    };

    // Navigate to crop page
    const handleCropImage = (imageId) => {
        navigate(`/image-crop/${imageId}`);
    };

    // Navigate to avatar setting page
    const handleSetAvatar = (imageId) => {
        navigate(`/image-crop/${imageId}?avatar=true`);
    };

    // Delete image
    const handleDelete = async (imageId) => {
        setLoading(true);
        try {
            await deleteImage(imageId);
            await loadImages();
            setError('');
            toast({
                title: "Image deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Error deleting image');
        }
        setLoading(false);
    };

    return (
        <Box maxW="1000px" mx="auto" mt={8} px={4}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <Text fontSize="2xl" fontWeight="bold">Your Gallery</Text>
                </Flex>

                {loading && <Spinner size="xl" mx="auto" />}
                {error && <Alert status="error"><AlertIcon />{error}</Alert>}

                {/* Main image preview */}
                {selectedImage && (
                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        mb={4}
                        w="100%"
                        maxW="800px"
                        mx="auto"
                        height="400px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.50"
                        boxShadow="md"
                        position="relative"
                    >
                        <Image
                            src={selectedImage.galleryUrl}
                            maxH="100%"
                            maxW="100%"
                            mx="auto"
                            objectFit="contain"
                            borderRadius="md"
                        />
                        <HStack position="absolute" bottom="10px" right="10px">
                            <Button
                                colorScheme="blue"
                                onClick={() => handleCropImage(selectedImage.id)}
                                leftIcon={<span role="img" aria-label="crop">✂️</span>}
                                size="sm"
                            >
                                Crop
                            </Button>
                            <Button
                                colorScheme="purple"
                                onClick={() => handleSetAvatar(selectedImage.id)}
                                leftIcon={<span role="img" aria-label="avatar">👤</span>}
                                size="sm"
                            >
                                Set as Avatar
                            </Button>
                        </HStack>
                        <Box position="absolute" top="10px" left="10px" bg="blackAlpha.700" color="white" px={2} py={1} borderRadius="md">
                            <Text fontSize="sm">
                                {selectedImage.galleryWidth} × {selectedImage.galleryHeight} px
                            </Text>
                        </Box>
                        {selectedImage.isAvatar && (
                            <Badge 
                                position="absolute" 
                                top="10px" 
                                right="10px" 
                                colorScheme="purple" 
                                fontSize="0.8em" 
                                px={2} 
                                py={1}
                            >
                                Current Avatar
                            </Badge>
                        )}
                    </Box>
                )}

                {/* Upload section */}
                <Box 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    p={4} 
                    bg="white" 
                    boxShadow="sm"
                >
                    <Text fontWeight="medium" mb={3}>Upload New Image</Text>
                    <HStack>
                        <Input 
                            type="file" 
                            onChange={e => setFile(e.target.files[0])} 
                            accept="image/*"
                            p={1}
                        />
                        <Button 
                            onClick={handleUpload} 
                            isDisabled={!file} 
                            colorScheme="blue"
                            leftIcon={<span role="img" aria-label="upload">📤</span>}
                        >
                            Upload
                        </Button>
                    </HStack>
                </Box>

                {/* Thumbnails grid */}
                <Text fontWeight="medium" mt={2}>Your Images</Text>
                <Text fontSize="sm" color="gray.600">
                    Drag and drop to reorder. Click on an image to preview it.
                </Text>

                <Grid 
                    templateColumns="repeat(auto-fill, minmax(150px, 1fr))" 
                    gap={4}
                >
                    {images.map((img, idx) => (
                        <GridItem
                            key={img.id}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => handleDrop(idx)}
                            borderWidth="1px"
                            borderRadius="md"
                            p={2}
                            bg={img.isAvatar ? "purple.50" : "white"}
                            borderColor={selectedImage && selectedImage.id === img.id ? "blue.400" : img.isAvatar ? "purple.200" : "gray.200"}
                            boxShadow="sm"
                            transition="all 0.2s"
                            _hover={{ boxShadow: "md", borderColor: "blue.300" }}
                            position="relative"
                            cursor="pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            {img.isAvatar && (
                                <Badge 
                                    position="absolute" 
                                    top="-8px" 
                                    right="-8px" 
                                    colorScheme="purple" 
                                    fontSize="0.7em"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    boxShadow="sm"
                                >
                                    Avatar
                                </Badge>
                            )}

                            <Box 
                                position="relative" 
                                height="120px" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                                overflow="hidden"
                                borderRadius="md"
                                mb={2}
                            >
                                <Image
                                    src={img.thumbnailUrl}
                                    maxH="100%"
                                    maxW="100%"
                                    objectFit="contain"
                                />
                            </Box>

                            <Text fontSize="xs" color="gray.500" mb={1}>
                                ID: {img.id}
                            </Text>

                            <Text fontSize="xs" color="gray.500" mb={2}>
                                {img.thumbnailWidth}×{img.thumbnailHeight} px
                            </Text>

                            <HStack spacing={1} justify="center">
                                <IconButton
                                    aria-label="Crop image"
                                    icon={<span role="img" aria-label="crop">✂️</span>}
                                    size="xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCropImage(img.id);
                                    }}
                                />
                                <IconButton
                                    aria-label="Set as avatar"
                                    icon={<span role="img" aria-label="avatar">👤</span>}
                                    size="xs"
                                    colorScheme={img.isAvatar ? "purple" : "gray"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetAvatar(img.id);
                                    }}
                                />
                                <IconButton
                                    aria-label="Delete image"
                                    icon={<span role="img" aria-label="delete">🗑️</span>}
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(img.id);
                                    }}
                                />
                            </HStack>
                        </GridItem>
                    ))}
                </Grid>

                {images.length === 0 && !loading && (
                    <Box textAlign="center" py={10} color="gray.500">
                        <Text>No images in your gallery yet. Upload your first image!</Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default GalleryPage;

// // src/pages/GalleryPage.jsx
// import { useState, useEffect } from 'react';
// import {
//     Box, Button, Image, Input, VStack, HStack, Text, Spinner, Alert, AlertIcon
// } from '@chakra-ui/react';
// import {
//     fetchUserImages, uploadImage, cropImage, updateOrder, deleteImage
// } from '../services/galleryService';
//
// const GalleryPage = () => {
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [file, setFile] = useState(null);
//     const [dragIndex, setDragIndex] = useState(null);
//     const [cropParams, setCropParams] = useState({ x: 0, y: 0, width: 100, height: 100 });
//     const [cropImageId, setCropImageId] = useState(null);
//
//     const loadImages = async () => {
//         setLoading(true);
//         try {
//             setImages(await fetchUserImages());
//             setError('');
//         } catch (e) {
//             setError('Błąd ładowania zdjęć');
//         }
//         setLoading(false);
//     };
//
//     useEffect(() => { loadImages(); }, []);
//
//     // Upload zdjęcia
//     const handleUpload = async () => {
//         if (!file) return;
//         setLoading(true);
//         try {
//             await uploadImage(file);
//             setFile(null);
//             await loadImages();
//         } catch {
//             setError('Błąd uploadu');
//         }
//         setLoading(false);
//     };
//
//     // Drag & drop zmiana kolejności
//     const handleDragStart = (idx) => setDragIndex(idx);
// // Drag & drop zmiana kolejności
//     const handleDrop = async (idx) => {
//         if (dragIndex === null || dragIndex === idx) return;
//
//         setLoading(true);
//         try {
//             // Przenosimy element w lokalnej tablicy
//             const newImages = [...images];
//             const [moved] = newImages.splice(dragIndex, 1);
//             newImages.splice(idx, 0, moved);
//
//             // Przygotuj dane w formie zgodnej z DTO na backendzie
//             const orderDTO = {
//                 images: newImages.map((img, i) => ({
//                     id: img.id,
//                     displayOrder: i
//                 }))
//             };
//
//             // Zaktualizuj stan przed żądaniem API
//             setImages(newImages);
//
//             // Wyślij nową kolejność do API
//             await updateOrder(orderDTO);
//             setError('');
//         } catch (e) {
//             setError('Błąd podczas zmiany kolejności zdjęć');
//             // W razie błędu, odśwież zdjęcia z serwera
//             await loadImages();
//         } finally {
//             setLoading(false);
//             setDragIndex(null);
//         }
//     };
//
//     // Kadrowanie (prosty input)
//     const handleCrop = async () => {
//         if (!cropImageId) return;
//         setLoading(true);
//         try {
//             await cropImage(cropImageId, cropParams);
//             setCropImageId(null);
//             await loadImages();
//         } catch {
//             setError('Błąd kadrowania');
//         }
//         setLoading(false);
//     };
//
//     // Funkcja obsługująca usuwanie zdjęcia
//     const handleDelete = async (imageId) => {
//         setLoading(true);
//         try {
//             await deleteImage(imageId);
//             await loadImages();
//             setError('');
//         } catch {
//             setError('Błąd podczas usuwania zdjęcia');
//         }
//         setLoading(false);
//     };
//
//     return (
//         <Box maxW="600px" mx="auto" mt={8}>
//             <VStack spacing={4}>
//                 <Text fontWeight="bold">Twoja galeria</Text>
//                 {loading && <Spinner />}
//                 {error && <Alert status="error"><AlertIcon />{error}</Alert>}
//
//                 {/* Upload */}
//                 <HStack>
//                     <Input type="file" onChange={e => setFile(e.target.files[0])} />
//                     <Button onClick={handleUpload} isDisabled={!file}>Wyślij</Button>
//                 </HStack>
//
//                 {/* Lista zdjęć z drag&drop */}
//                 <VStack spacing={2} align="stretch">
//                     {images.map((img, idx) => (
//                         <HStack
//                             key={img.id}
//                             draggable
//                             onDragStart={() => handleDragStart(idx)}
//                             onDragOver={e => e.preventDefault()}
//                             onDrop={() => handleDrop(idx)}
//                             border="1px solid #ccc"
//                             borderRadius="md"
//                             p={2}
//                             bg={img.isMain ? "blue.50" : "white"}
//                         >
//                             <Image src={img.thumbnailUrl} boxSize="60px" objectFit="cover" />
//                             <Text flex="1">ID: {img.id}</Text>
//                             <Button size="sm" onClick={() => setCropImageId(img.id)}>
//                                 Kadruj
//                             </Button>
//                             <Button size="sm" colorScheme="red" onClick={() => handleDelete(img.id)}>
//                                 Usuń
//                             </Button>
//                         </HStack>
//                     ))}
//                 </VStack>
//
//                 {/* Kadrowanie */}
//                 {cropImageId && (
//                     <Box border="1px solid #eee" p={3} borderRadius="md">
//                         <Text>Kadruj zdjęcie ID: {cropImageId}</Text>
//                         <HStack>
//                             <Input
//                                 placeholder="x"
//                                 type="number"
//                                 value={cropParams.x}
//                                 onChange={e => setCropParams({ ...cropParams, x: Number(e.target.value) })}
//                                 width="60px"
//                             />
//                             <Input
//                                 placeholder="y"
//                                 type="number"
//                                 value={cropParams.y}
//                                 onChange={e => setCropParams({ ...cropParams, y: Number(e.target.value) })}
//                                 width="60px"
//                             />
//                             <Input
//                                 placeholder="width"
//                                 type="number"
//                                 value={cropParams.width}
//                                 onChange={e => setCropParams({ ...cropParams, width: Number(e.target.value) })}
//                                 width="60px"
//                             />
//                             <Input
//                                 placeholder="height"
//                                 type="number"
//                                 value={cropParams.height}
//                                 onChange={e => setCropParams({ ...cropParams, height: Number(e.target.value) })}
//                                 width="60px"
//                             />
//                             <Button onClick={handleCrop}>Zapisz kadr</Button>
//                             <Button onClick={() => setCropImageId(null)} colorScheme="red">Anuluj</Button>
//                         </HStack>
//                     </Box>
//                 )}
//             </VStack>
//         </Box>
//     );
// };
//
// export default GalleryPage;
