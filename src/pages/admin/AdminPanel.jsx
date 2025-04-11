import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Icon,
    Flex,
    Text,
    Link,
    Button
} from '@chakra-ui/react';
import { FiUsers, FiSettings, FiList } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const AdminPanel = () => {
    const boxBg = useColorModeValue('white', 'gray.700');

    return (
        <Container maxW="6xl" py={8}>
            <Box mb={8}>
                <Heading as="h1" size="xl">Panel Administracyjny</Heading>
                <Text mt={2} color="gray.500">Zarządzaj użytkownikami i konfiguracją aplikacji</Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Box
                    bg={boxBg}
                    p={6}
                    rounded="xl"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                    <Flex alignItems="center" mb={4}>
                        <Icon as={FiUsers} boxSize={8} color="blue.500" mr={4} />
                        <Heading as="h3" size="md">Zarządzanie Użytkownikami</Heading>
                    </Flex>
                    <Text mb={4}>
                        Przeglądaj, edytuj i zarządzaj kontami użytkowników. Możesz zmienić role, blokować konta
                        i zarządzać zdjęciami profilowymi.
                    </Text>
                    <Button
                        as={RouterLink}
                        to="/admin/users"
                        colorScheme="blue"
                        mt={2}
                        width="100%"
                    >
                        Przejdź do użytkowników
                    </Button>
                </Box>

                <Box
                    bg={boxBg}
                    p={6}
                    rounded="xl"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                    <Flex alignItems="center" mb={4}>
                        <Icon as={FiList} boxSize={8} color="green.500" mr={4} />
                        <Heading as="h3" size="md">Sekcje Profilowe</Heading>
                    </Flex>
                    <Text mb={4}>
                        Zarządzaj sekcjami profilu użytkowników. Dodawaj, edytuj i usuwaj pola oraz dostosowuj
                        ich kolejność wyświetlania.
                    </Text>
                    <Button
                        as={RouterLink}
                        to="/admin/profile-sections"
                        colorScheme="green"
                        mt={2}
                        width="100%"
                    >
                        Zarządzaj sekcjami
                    </Button>
                </Box>

                <Box
                    bg={boxBg}
                    p={6}
                    rounded="xl"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                    <Flex alignItems="center" mb={4}>
                        <Icon as={FiSettings} boxSize={8} color="purple.500" mr={4} />
                        <Heading as="h3" size="md">Konfiguracja Aplikacji</Heading>
                    </Flex>
                    <Text mb={4}>
                        Zarządzaj ustawieniami aplikacji, takimi jak limity zdjęć, parametry systemowe
                        i inne konfiguracje.
                    </Text>
                    <Button
                        as={RouterLink}
                        to="/admin/config"
                        colorScheme="purple"
                        mt={2}
                        width="100%"
                    >
                        Przejdź do konfiguracji
                    </Button>
                </Box>
            </SimpleGrid>
        </Container>
    );
};

export default AdminPanel;