// src/components/admin/AdminUserAccountForm.jsx
import { useState } from 'react';
import { Stack, FormControl, FormLabel, Input, Select, FormErrorMessage, Text, Button, Flex } from '@chakra-ui/react';

const AdminUserAccountForm = ({
                                  userData,
                                  handleChange,
                                  onSubmit,
                                  saving
                              }) => {
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password) => {
        if (!password) return true;
        if (password.length < 8) {
            setPasswordError('Hasło musi mieć minimum 8 znaków');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną wielką literę');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną małą literę');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError('Hasło musi zawierać co najmniej jedną cyfrę');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleFormSubmit = (e) => {
        if (newPassword && !validatePassword(newPassword)) {
            e.preventDefault();
            return;
        }
        onSubmit(e, newPassword);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" value={userData.email} onChange={handleChange} />
                </FormControl>
            </Stack>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                <FormControl isInvalid={!!passwordError}>
                    <FormLabel>Nowe hasło</FormLabel>
                    <Input
                        type="password"
                        placeholder="Pozostaw puste, aby nie zmieniać"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <Text fontSize="xs" color="gray.500">
                        Min. 8 znaków, wielka i mała litera, cyfra
                    </Text>
                    {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                </FormControl>
                <FormControl>
                    <FormLabel>Rola</FormLabel>
                    <Select name="role" value={userData.role} onChange={handleChange}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </Select>
                </FormControl>
            </Stack>
            <Flex justify="flex-end" gap={4} pt={2}>
                <Button colorScheme="blue" type="submit" isLoading={saving}>
                    Zapisz zmiany
                </Button>
            </Flex>
        </form>
    );
};

export default AdminUserAccountForm;