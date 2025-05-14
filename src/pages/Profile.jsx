import { Box, Container, Flex, Text, Heading, Badge, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useProfileContext } from '../context/ProfileContext';
import ProfilePersonalInfo from '../components/profile/ProfilePersonalInfo';
import ProfileSections from '../components/profile/ProfileSections';

const Profile = () => {
    const { isEditable, isViewable, profileId, loading, error } = useProfileContext();

    if (loading) {
        return (
            <Container maxW="container.md" py={8}>
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" />
                </Flex>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.md" py={8}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={8}>
            <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="md">
                <Heading size="md" mb={4}>Informacje o kontekście profilu</Heading>
                <Text mb={2}>ID profilu: {profileId}</Text>
                <Text mb={2}>Możliwość edycji: {isEditable ? "Tak" : "Nie"}</Text>
                <Text mb={2}>Widoczność profilu: {isViewable ? "Tak" : "Nie"}</Text>
                <Flex gap={2} mt={4}>
                    <Badge colorScheme={isEditable ? "green" : "red"}>
                        {isEditable ? "Edytowalny" : "Nieedytowalny"}
                    </Badge>
                    <Badge colorScheme={isViewable ? "green" : "red"}>
                        {isViewable ? "Widoczny" : "Niewidoczny"}
                    </Badge>
                </Flex>
                <ProfilePersonalInfo />
                <ProfileSections />
            </Box>
        </Container>
    );
};

export default Profile;