// src/components/profile/ProfileSections.jsx
import { useEffect, useState } from 'react';
import { Box, Heading, Textarea, Button, Text, Stack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useProfileContext } from '../../context/ProfileContext';
import { getProfileSections, updateProfileSection } from '../../services/profileService';

const ProfileSections = () => {
    const { profileId, isEditable } = useProfileContext();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getProfileSections(profileId !== 'me' ? profileId : null)
            .then(setSections)
            .catch(e => setError(e?.response?.data?.message || e?.message))
            .finally(() => setLoading(false));
    }, [profileId]);

    const handleEdit = (idx) => {
        setEditIndex(idx);
        setEditContent(sections[idx].content || '');
    };

    const handleSave = async (sectionId) => {
        setSaving(true);
        setError(null);
        try {
            await updateProfileSection(sectionId, editContent);
            setSections(sections =>
                sections.map((s, i) =>
                    i === editIndex ? { ...s, content: editContent } : s
                )
            );
            setEditIndex(null);
        } catch (e) {
            setError(e?.response?.data?.message || e?.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Spinner size="md" />;
    }
    if (error) {
        return (
            <Alert status="error" borderRadius="md" mb={4}>
                <AlertIcon />
                {error}
            </Alert>
        );
    }
    if (!sections.length) {
        return <Text>Brak sekcji do wyświetlenia.</Text>;
    }

    return (
        <Box mt={8}>
            <Heading size="md" mb={4}>Sekcje profilu</Heading>
            <Stack spacing={6}>
                {sections.map((section, idx) => (
                    <Box key={section.sectionId} borderWidth="1px" borderRadius="md" p={4}>
                        <Text fontWeight="bold" mb={2}>{section.sectionName}{section.required ? ' *' : ''}</Text>
                        {editIndex === idx ? (
                            <>
                                <Textarea
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    mb={2}
                                />
                                <Stack direction="row">
                                    <Button
                                        colorScheme="blue"
                                        size="sm"
                                        onClick={() => handleSave(section.sectionId)}
                                        isLoading={saving}
                                    >
                                        Zapisz
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditIndex(null)}
                                        isDisabled={saving}
                                    >
                                        Anuluj
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Text whiteSpace="pre-line" mb={2}>{section.content || <i>Brak treści</i>}</Text>
                                {isEditable && (
                                    <Button size="xs" onClick={() => handleEdit(idx)}>
                                        Edytuj
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default ProfileSections;