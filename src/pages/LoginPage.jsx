import React, { useState } from 'react';
import { Box, Heading, Button, VStack, Text, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // TODO: replace with real authentication logic
    if (email === 'user@example.com' && password === 'password') {
      // on successful login, redirect
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Log In
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <Button type="submit" colorScheme="teal" width="full">
            Log In
          </Button>

          <Text fontSize="sm">
            Don't have an account?{' '}
            <Link color="teal.500" onClick={() => navigate('/signup')}>
              Sign Up
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
