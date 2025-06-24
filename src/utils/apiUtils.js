import api from '../services/api';

export const apiCall = async (endpoint, method, data = null, options = {}) => {
  try {
    const response = await api[method](endpoint, data, options);
    return response.data;
  } catch (error) {
    console.error(`API error (${method} ${endpoint}):`, error);
    throw error;
  }
};

export const handleApiError = (error, setError, toast = null, customMessage = 'An error occurred') => {
  setError(customMessage);

  if (toast) {
    toast({
      title: customMessage,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }

  console.error(customMessage, error);
};
