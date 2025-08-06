import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Icon,
  Text,
} from '@chakra-ui/react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box bg="#99ddc8ff" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold">Hiking Planner</Box>

        <HStack
          as="nav"
          spacing={8}
          alignItems="center"
          display={{ base: 'none', md: 'flex' }}
        >
          <Button as={RouterLink} to="/" className='NavbarButton'>
            Home
          </Button>
          
          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <Text fontSize="sm">Welcome, {user?.fullName}!</Text>
                  <Button 
                    leftIcon={<Icon as={LogOut} />}
                    onClick={handleLogout}
                    className='NavbarButton'
                    variant="outline"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button as={RouterLink} to="/login" className='NavbarButton'>
                    Login
                  </Button>
                  <Button as={RouterLink} to="/signup" className='NavbarButton'>
                    Sign Up
                  </Button>
                </>
              )}
            </>
          )}
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
            
            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Text fontSize="sm">Welcome, {user?.fullName}!</Text>
                    <Button 
                      leftIcon={<Icon as={LogOut} />}
                      onClick={handleLogout}
                      variant="ghost"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={RouterLink} to="/login" variant="ghost">
                      Login
                    </Button>
                    <Button as={RouterLink} to="/signup" variant="ghost">
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}