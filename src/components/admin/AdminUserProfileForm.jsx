// src/components/admin/AdminUserProfileForm.jsx
import { Stack, FormControl, FormLabel, Input, Select, Textarea } from '@chakra-ui/react';

const AdminUserProfileForm = ({
                                  userData,
                                  handleChange,
                                  handleDateChange
                              }) => (
    <>
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
            <FormControl>
                <FormLabel>Imię</FormLabel>
                <Input name="firstName" value={userData.firstName || ''} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <FormLabel>Nazwisko</FormLabel>
                <Input name="lastName" value={userData.lastName || ''} onChange={handleChange} />
            </FormControl>
        </Stack>
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
            <FormControl>
                <FormLabel>Płeć</FormLabel>
                <Select name="gender" value={userData.gender || ''} onChange={handleChange}>
                    <option value="">-- Wybierz --</option>
                    <option value="MALE">Mężczyzna</option>
                    <option value="FEMALE">Kobieta</option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Data urodzenia</FormLabel>
                <Input type="date" value={userData.dateOfBirth || ''} onChange={handleDateChange} />
            </FormControl>
        </Stack>
        <FormControl mb={4}>
            <FormLabel>Bio</FormLabel>
            <Textarea name="bio" value={userData.bio || ''} onChange={handleChange} rows={5} />
        </FormControl>
    </>
);

export default AdminUserProfileForm;