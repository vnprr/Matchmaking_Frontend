// src/components/profile/ProfilePersonalInfo.jsx
import { useState, useEffect } from 'react';
import { Box, Text, Heading, Stack, useColorModeValue, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

const ProfilePersonalInfo = ({ profile: initialProfile }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { role } = useAuth();
    const bgColor = useColorModeValue('gray.50', 'gray.600');

    // Formatowanie daty
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('pl-PL');
    };

    // Wyliczenie wieku na podstawie daty urodzenia
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;

        const birthDate = new Date(dateOfBirth);
        if (isNaN(birthDate.getTime())) return null;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // Obliczanie wieku jeśli nie jest dostarczone bezpośrednio
    const age = initialProfile?.age || (initialProfile?.dateOfBirth ? calculateAge(initialProfile.dateOfBirth) : null);

    return (
        <Box width="100%" mb={4}>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {loading ? (
                <Spinner size="md" />
            ) : (
                <Box borderRadius="md">
                    {initialProfile?.firstName && initialProfile?.lastName && (
                        <Box>
                            <Heading as="h1" size="2xl" >
                                {initialProfile.firstName} {initialProfile.lastName}
                            </Heading>

                        </Box>
                    )}

                    <Stack spacing={3}>

                        {age && (
                            <Box>
                                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                                    Wiek: {age} lat</Text>
                            </Box>
                        )}

                        {initialProfile?.gender && (
                            <Box>
                                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                                    Płeć:
                                </Text>
                                <Text>
                                    {initialProfile.gender === 'MALE' ? 'Mężczyzna' :
                                        initialProfile.gender === 'FEMALE' ? 'Kobieta' :
                                            initialProfile.gender}
                                </Text>
                            </Box>
                        )}

                        {/*{initialProfile?.dateOfBirth && (*/}
                        {/*    <Box>*/}
                        {/*        <Text fontWeight="bold" fontSize="sm" color="gray.500">*/}
                        {/*            Data urodzenia:*/}
                        {/*        </Text>*/}
                        {/*        <Text>{formatDate(initialProfile.dateOfBirth)}</Text>*/}
                        {/*    </Box>*/}
                        {/*)}*/}

                        {/*{initialProfile?.bio && (*/}
                        {/*    <Box>*/}
                        {/*        <Text fontWeight="bold" fontSize="sm" color="gray.500">*/}
                        {/*            O mnie:*/}
                        {/*        </Text>*/}
                        {/*        <Text>{initialProfile.bio}</Text>*/}
                        {/*    </Box>*/}
                        {/*)}*/}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default ProfilePersonalInfo;