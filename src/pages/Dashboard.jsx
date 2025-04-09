import { Link } from 'react-router-dom';
import { Container, Heading, Button, Box, useColorModeValue } from '@chakra-ui/react';

const Dashboard = () => {
    const bgColor = useColorModeValue('white', 'gray.700');

    return (
        <Container maxW="md" py={8}>
            <Box
                bg={bgColor}
                rounded="xl"
                boxShadow="lg"
                p={6}
                textAlign="center"
            >
                <Heading size="lg" mb={6}>Witam na Dashboardzie!</Heading>
                <Button as={Link} to="/profile" colorScheme="blue">
                    Mój Profil
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;