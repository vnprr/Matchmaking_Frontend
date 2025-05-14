// src/components/admin/AdminUserStats.jsx
import { Box, Flex, Stat, StatLabel, StatNumber, Badge } from '@chakra-ui/react';

const AdminUserStats = ({ userData, formatDate, statBgColor }) => (
    <Box p={4} bg={statBgColor} rounded="md">
        <Flex wrap="wrap" gap={16} justify="space-between">
            <Stat>
                <StatLabel>ID użytkownika</StatLabel>
                <StatNumber>{userData.id}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Data utworzenia</StatLabel>
                <StatNumber fontSize="md">{formatDate(userData.createdAt)}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Ostatnia aktualizacja</StatLabel>
                <StatNumber fontSize="md">{formatDate(userData.updatedAt)}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Dostawca</StatLabel>
                <StatNumber fontSize="md">{userData.provider}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Status</StatLabel>
                <Badge colorScheme={userData.enabled ? 'green' : 'red'} fontSize="md" py={1} px={2}>
                    {userData.enabled ? 'Aktywny' : 'Zablokowany'}
                </Badge>
            </Stat>
        </Flex>
    </Box>
);

export default AdminUserStats;