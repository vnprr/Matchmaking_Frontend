// src/components/admin/AdminUserSecurity.jsx
import { Box, Flex, Text, FormControl, Switch, FormLabel, Badge, Button, HStack } from '@chakra-ui/react';

const AdminUserSecurity = ({
                               userData,
                               toggleAccountStatus,
                               resetLoginAttempts,
                               formatDate
                           }) => (
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={4} mb={4}>
        <Box>
            <Text fontWeight="bold">Status konta</Text>
            <FormControl display="flex" alignItems="center">
                <Switch
                    id="account-status"
                    isChecked={userData.enabled}
                    onChange={toggleAccountStatus}
                    colorScheme="green"
                />
                <FormLabel htmlFor="account-status" mb="0" ml={2}>
                    {userData.enabled ? 'Aktywne' : 'Zablokowane'}
                </FormLabel>
            </FormControl>
        </Box>
        <Box>
            <Text fontWeight="bold">Nieudane próby logowania</Text>
            <HStack>
                <Badge colorScheme="red" fontSize="md">{userData.failedLoginAttempts}</Badge>
                <Button size="sm" onClick={resetLoginAttempts}>Resetuj</Button>
            </HStack>
        </Box>
        <Box>
            <Text fontWeight="bold">Blokada do</Text>
            <Text>{userData.accountLockedUntil ? formatDate(userData.accountLockedUntil) : 'Brak'}</Text>
        </Box>
    </Flex>
);

export default AdminUserSecurity;