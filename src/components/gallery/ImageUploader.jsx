import { useState } from 'react';
import { Box, Button, Input, HStack, Text, useToast } from '@chakra-ui/react';
import { uploadImage } from '../../services/galleryService';
import { handleApiError } from '../../utils/apiUtils';

/**
 * Component for uploading images to the gallery
 * @param {Function} onUploadSuccess - Callback function to run after successful upload
 */
const ImageUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      await uploadImage(file);
      setFile(null);
      
      toast({
        title: "Image uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      handleApiError(error, setError, toast, 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          isDisabled={!file || loading} 
          isLoading={loading}
          colorScheme="blue"
          leftIcon={<span role="img" aria-label="upload">📤</span>}
        >
          Upload
        </Button>
      </HStack>
      {error && <Text color="red.500" mt={2}>{error}</Text>}
    </Box>
  );
};

export default ImageUploader;