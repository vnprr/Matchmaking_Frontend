import { Box, Container, Flex, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useProfileContext } from '../context/ProfileContext';
import ProfilePersonalInfo from '../components/profile/ProfilePersonalInfo';
import ProfileSections from '../components/profile/ProfileSections';
import ProfileMessageButton from "../components/profile/ProfileMessageButton.jsx";

const Profile = () => {
    const { profileId, loading, error, profile } = useProfileContext();

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
                <ProfilePersonalInfo />
                <ProfileSections />
                <ProfileMessageButton
                    profileId={profileId}
                    profileName={profile?.personalInfo?.fullName || "Użytkownik"}
                />
            </Box>
        </Container>
    );
};

export default Profile;
