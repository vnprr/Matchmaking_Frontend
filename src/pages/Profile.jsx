import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Heading,
    Flex,
    Spinner,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import ProfileImages from '../components/profile/ProfileImages';
import ProfileSections from '../components/profile/ProfileSections';
import ProfilePersonalInfo from '../components/profile/ProfilePersonalInfo';
import Gallery from "../components/Gallery.jsx";
import api from '../services/api';
import ProfileAvatar from "../components/profile/ProfileAvatar.jsx";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const profileResponse = await api.get('/api/profile');
                setProfile(profileResponse.data);
            } catch (err) {
                console.error('Błąd pobierania profilu:', err);
                setError('Nie udało się pobrać danych profilu');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <Container maxW="container.lg" py={8}>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {loading ? (
                <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                </Flex>
            ) : (
                <Flex direction="column" md="row" gap={6} minChildWidth="250px">

                    <ProfileAvatar borderRadius="none" size="2xl"></ProfileAvatar>

                    {/* Nowy komponent z danymi osobowymi */}
                    <ProfilePersonalInfo profile={profile} />

                    {/* Komponent z galerią zdjęć */}
                    <ProfileImages />

                    {/* Komponent z sekcjami profilu */}
                    <ProfileSections />

                    <Gallery />
                </Flex>
            )}
        </Container>
    );
};

export default Profile;