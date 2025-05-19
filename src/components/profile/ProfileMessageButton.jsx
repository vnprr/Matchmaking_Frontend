import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { sendMessage } from '../../services/chatService';
import { useToast } from '@chakra-ui/react';

const ProfileMessageButton = ({ profileId, profileName }) => {
    const navigate = useNavigate();
    const toast = useToast();

    const handleMessageClick = async () => {
        try {
            // Konwertujemy profileId na liczbę przed wysłaniem
            const numericProfileId = Number(profileId);

            await sendMessage(numericProfileId, `Cześć ${profileName}! Czy możemy porozmawiać?`);

            // Przekierowanie do czatu
            navigate('/chat');
        } catch (error) {
            toast({
                title: 'Błąd',
                description: 'Nie udało się rozpocząć konwersacji',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Button
            colorScheme="blue"
            onClick={handleMessageClick}
            mt={4}
            w="100%"
        >
            Wyślij wiadomość
        </Button>
    );
};

export default ProfileMessageButton;