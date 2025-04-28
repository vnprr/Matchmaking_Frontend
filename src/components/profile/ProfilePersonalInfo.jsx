// src/components/profile/ProfilePersonalInfo.jsx
import { Box, Text, Input, Button, Stack, useToast, Select } from '@chakra-ui/react';
import { useProfileContext } from '../../context/ProfileContext';
import { useState, useEffect } from 'react';

const genderOptions = [
    { value: '', label: 'Nie wybrano' },
    { value: 'MALE', label: 'Mężczyzna' },
    { value: 'FEMALE', label: 'Kobieta' }
];

const ProfilePersonalInfo = () => {
    const { personal, isEditable, updatePersonal } = useProfileContext();
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setForm({
            firstName: personal?.firstName || '',
            lastName: personal?.lastName || '',
            gender: personal?.gender || '',
            dateOfBirth: personal?.dateOfBirth || '',
            bio: personal?.bio || ''
        });
    }, [personal]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const dataToSend = Object.fromEntries(
                Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
            );
            await updatePersonal(dataToSend);
            toast({title: "Zapisano zmiany", status: "success", duration: 2000});
            setEdit(false);
            // } catch {
            //     toast({ title: "Błąd zapisu", status: "error", duration: 2000 });
            } catch (e) {
                toast({
                    title: "Błąd zapisu",
                    status: "error",
                    duration: 4000,
                    description: e?.response?.data?.message || e?.message || "Nieznany błąd"
                });
            } finally {
                setLoading(false);
            }
    };

    if (!personal) return null;

    return (
        <Box mt={6}>
            {edit ? (
                <Stack spacing={2}>
                    <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Imię" />
                    <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nazwisko" />
                    <Select name="gender" value={form.gender || ''} onChange={handleChange} placeholder="Wybierz płeć">
                        {genderOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                    <Input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} placeholder="Data urodzenia" type="date" />
                    <Input name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
                    <Stack direction="row">
                        <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>Zapisz</Button>
                        <Button onClick={() => setEdit(false)} variant="ghost">Anuluj</Button>
                    </Stack>
                </Stack>
            ) : (
                <>
                    <Text><b>Imię:</b> {personal.firstName}</Text>
                    <Text><b>Nazwisko:</b> {personal.lastName}</Text>
                    <Text><b>Płeć:</b> {personal.gender === 'MALE' ? 'Mężczyzna' : personal.gender === 'FEMALE' ? 'Kobieta' : ''}</Text>
                    <Text><b>Data urodzenia:</b> {personal.dateOfBirth}</Text>
                    <Text><b>Bio:</b> {personal.bio}</Text>
                    {isEditable && (
                        <Button mt={3} size="sm" onClick={() => setEdit(true)}>
                            Edytuj dane
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default ProfilePersonalInfo;