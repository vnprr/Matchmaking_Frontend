import { Box, Image, HStack, Button, Badge, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * Component for displaying a preview of a selected image
 * @param {Object} image - The image object to display
 */
const ImagePreview = ({ image }) => {
  const navigate = useNavigate();

  if (!image) return null;

  const handleCropImage = () => {
    navigate(`/image-crop/${image.id}`);
  };

  const handleSetAvatar = () => {
    navigate(`/image-crop/${image.id}?avatar=true`);
  };

  return (
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
        src={image.galleryUrl}
        maxH="100%"
        maxW="100%"
        mx="auto"
        objectFit="contain"
        borderRadius="md"
      />
      <HStack position="absolute" bottom="10px" right="10px">
        <Button
          colorScheme="blue"
          onClick={handleCropImage}
          leftIcon={<span role="img" aria-label="crop">✂️</span>}
          size="sm"
        >
          Crop
        </Button>
        <Button
          colorScheme="purple"
          onClick={handleSetAvatar}
          leftIcon={<span role="img" aria-label="avatar">👤</span>}
          size="sm"
        >
          Set as Avatar
        </Button>
      </HStack>
      <Box position="absolute" top="10px" left="10px" bg="blackAlpha.700" color="white" px={2} py={1} borderRadius="md">
        <Text fontSize="sm">
          {image.galleryWidth} × {image.galleryHeight} px
        </Text>
      </Box>
      {image.isAvatar && (
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
  );
};

export default ImagePreview;