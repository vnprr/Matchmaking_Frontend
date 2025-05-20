// import { useState, useEffect } from 'react';
// import {
//     Box,
//     Image,
//     Flex,
//     IconButton,
//     Spinner,
//     HStack,
//     VStack,
//     AspectRatio,
//     Text,
//     Alert,
//     AlertIcon,
//     useColorModeValue
// } from '@chakra-ui/react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
// import api from '../services/api';
//
// const Gallery = () => {
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//
//     // Tło dla navButtons
//     const navButtonBg = useColorModeValue('whiteAlpha.700', 'blackAlpha.700');
//
//     // Pobieranie zdjęć użytkownika
//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 setLoading(true);
//                 const response = await api.get('/api/profile/images/all');
//                 setImages(response.data || []);
//
//                 // Ustaw indeks głównego zdjęcia (jeśli jest)
//                 const profileImageIndex = response.data.findIndex(img => img.profileImage);
//                 if (profileImageIndex >= 0) {
//                     setCurrentImageIndex(profileImageIndex);
//                 }
//             } catch (err) {
//                 console.error('Błąd podczas pobierania zdjęć:', err);
//                 setError('Nie udało się pobrać zdjęć');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchImages();
//     }, []);
//
//     // Nawigacja po zdjęciach
//     const handlePreviousImage = () => {
//         setCurrentImageIndex((prevIndex) =>
//             prevIndex === 0 ? images.length - 1 : prevIndex - 1
//         );
//     };
//
//     const handleNextImage = () => {
//         setCurrentImageIndex((prevIndex) =>
//             prevIndex === images.length - 1 ? 0 : prevIndex + 1
//         );
//     };
//
//     // Wybór zdjęcia przez kliknięcie miniaturki
//     const handleThumbnailClick = (index) => {
//         setCurrentImageIndex(index);
//     };
//
//     if (loading) {
//         return (
//             <Box width="100%" textAlign="center" py={6}>
//                 <Spinner size="xl" />
//             </Box>
//         );
//     }
//
//     if (error) {
//         return (
//             <Alert status="error" borderRadius="md">
//                 <AlertIcon />
//                 {error}
//             </Alert>
//         );
//     }
//
//     if (images.length === 0) {
//         return (
//             <Box textAlign="center" py={6}>
//                 <Text color="gray.500">Brak dostępnych zdjęć</Text>
//             </Box>
//         );
//     }
//
//     return (
//         <Box width="100%" my={6}>
//             <VStack spacing={4} align="center">
//                 {/* Główne zdjęcie z proporcjami 4:5 */}
//                 <Box
//                     position="relative"
//                     width="100%"
//                     maxW="400px"
//                     borderRadius="lg"
//                     overflow="hidden"
//                     boxShadow="md"
//                 >
//                     <AspectRatio ratio={4/5} width="100%">
//                         <Image
//                             src={images[currentImageIndex]?.imageUrl}
//                             alt={`Zdjęcie ${currentImageIndex + 1}`}
//                             objectFit="cover"
//                         />
//                     </AspectRatio>
//
//                     {/* Strzałki nawigacyjne */}
//                     <Flex
//                         position="absolute"
//                         top="0"
//                         bottom="0"
//                         left="0"
//                         right="0"
//                         justify="space-between"
//                         align="center"
//                         px={2}
//                     >
//                         <IconButton
//                             icon={<ChevronLeftIcon boxSize={6} />}
//                             aria-label="Poprzednie zdjęcie"
//                             onClick={handlePreviousImage}
//                             bg={navButtonBg}
//                             _hover={{ bg: useColorModeValue('whiteAlpha.800', 'blackAlpha.800') }}
//                             size="md"
//                             isRound
//                         />
//                         <IconButton
//                             icon={<ChevronRightIcon boxSize={6} />}
//                             aria-label="Następne zdjęcie"
//                             onClick={handleNextImage}
//                             bg={navButtonBg}
//                             _hover={{ bg: useColorModeValue('whiteAlpha.800', 'blackAlpha.800') }}
//                             size="md"
//                             isRound
//                         />
//                     </Flex>
//                 </Box>
//
//                 {/* Miniaturki zdjęć */}
//                 <HStack spacing={2} overflowX="auto" width="100%" py={2} justifyContent="center">
//                     {images.map((image, index) => (
//                         <Box
//                             key={image.id}
//                             boxSize="60px"
//                             borderRadius="md"
//                             overflow="hidden"
//                             cursor="pointer"
//                             opacity={index === currentImageIndex ? 1 : 0.6}
//                             border={index === currentImageIndex ? "2px solid" : "none"}
//                             borderColor="blue.500"
//                             onClick={() => handleThumbnailClick(index)}
//                             transition="all 0.2s"
//                             _hover={{ opacity: 0.9 }}
//                         >
//                             <Image
//                                 src={image.imageUrl}
//                                 alt={`Miniaturka ${index + 1}`}
//                                 boxSize="100%"
//                                 objectFit="cover"
//                             />
//                         </Box>
//                     ))}
//                 </HStack>
//             </VStack>
//         </Box>
//     );
// };
//
// export default Gallery;