
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="#99DDC8" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold">MyApp</Box>

        <HStack
          as="nav"
          spacing={8}
          alignItems="center"
          display={{ base: 'none', md: 'flex' }}
        >
          <Button as={RouterLink} to="/" className='NavbarButton'>
            Home
          </Button>
          <Button as={RouterLink} to="/login" className='NavbarButton'>
            Login
          </Button>
          <Button as={RouterLink} to="/signup" className='NavbarButton'>
            Sign Up
          </Button>
        </HStack>

        <IconButton
          size="md"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          icon={<Icon as={isOpen ? X : Menu} boxSize={5} />}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            <Button as={RouterLink} to="/" variant="ghost">
              Home
            </Button>
            <Button as={RouterLink} to="/login" variant="ghost">
              Login
            </Button>
            <Button as={RouterLink} to="/signup" variant="ghost">
              Sign Up
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
