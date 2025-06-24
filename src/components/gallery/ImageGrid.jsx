import { useState } from 'react';
import { Grid, GridItem, Image, Box, Text, HStack, IconButton, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * Component for displaying a grid of images with drag-and-drop reordering
 * @param {Array} images - Array of image objects to display
 * @param {Function} onImageSelect - Callback when an image is selected
 * @param {Function} onImageDelete - Callback when delete is clicked
 * @param {Function} onOrderChange - Callback when images are reordered
 * @param {Object} selectedImage - Currently selected image
 */
const ImageGrid = ({
  images = [],
  onImageSelect,
  onImageDelete,
  onOrderChange,
  selectedImage
}) => {
  const navigate = useNavigate();
  const [dragIndex, setDragIndex] = useState(null);

  // Handle drag start
  const handleDragStart = (idx) => setDragIndex(idx);

  // Handle drop for reordering
  const handleDrop = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;

    // Move element in array
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(idx, 0, moved);

    // Call parent callback with new order
    if (onOrderChange) {
      onOrderChange(newImages);
    }

    setDragIndex(null);
  };

  // Navigate to crop page
  const handleCropImage = (imageId, e) => {
    e.stopPropagation();
    navigate(`/image-crop/${imageId}`);
  };

  // Navigate to avatar setting page
  const handleSetAvatar = (imageId, e) => {
    e.stopPropagation();
    navigate(`/image-crop/${imageId}?avatar=true`);
  };

  // Handle delete
  const handleDelete = (imageId, e) => {
    e.stopPropagation();
    if (onImageDelete) {
      onImageDelete(imageId);
    }
  };

  return (
    <>
      <Text fontWeight="medium" mt={2}>Your Images</Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
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
            onClick={() => onImageSelect && onImageSelect(img)}
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
                onClick={(e) => handleCropImage(img.id, e)}
              />
              <IconButton
                aria-label="Set as avatar"
                icon={<span role="img" aria-label="avatar">👤</span>}
                size="xs"
                colorScheme={img.isAvatar ? "purple" : "gray"}
                onClick={(e) => handleSetAvatar(img.id, e)}
              />
              <IconButton
                aria-label="Delete image"
                icon={<span role="img" aria-label="delete">🗑️</span>}
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={(e) => handleDelete(img.id, e)}
              />
            </HStack>
          </GridItem>
        ))}
      </Grid>

      {images.length === 0 && (
        <Box textAlign="center" py={10} color="gray.500">
          <Text>No images in your gallery yet. Upload your first image!</Text>
        </Box>
      )}
    </>
  );
};

export default ImageGrid;