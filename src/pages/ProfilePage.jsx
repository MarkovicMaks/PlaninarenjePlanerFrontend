import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { Mail } from "lucide-react";
import UserTrails from "../components/UserTrails.jsx";
import Navbar from "../components/Navbar.jsx";

// 🚧  placeholder user dok se ne spoji backend
const mockUser = {
  id: 1,
  full_name: "Maks Marković",
  email: "maks@example.com",
  joined_at: "2024-09-12",
};

export default function ProfilePage() {
  return (
    <>
      <Navbar />
    <Box px={6} py={8} maxW="5xl" mx="auto">
      <Flex align="center" gap={6}>
        <Box>
          <Heading size="lg">{mockUser.full_name}</Heading>
          <Flex align="center" gap={2} color="gray.500">
            <Icon as={Mail} boxSize={4} />
            <Text>{mockUser.email}</Text>
          </Flex>
          <Text fontSize="sm" mt={1} color="gray.400">
            Član od {new Date(mockUser.joined_at).toLocaleDateString("hr-HR")}
          </Text>
        </Box>
      </Flex>
      <UserTrails userId={mockUser.id} />
    </Box>
    </>
  );
}
