import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Link,
  Field,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // TODO: replace with real authentication logic
    if (email === 'user@example.com' && password === 'password') {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Navbar />
    <div className="LoginPage">
      
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" background={'#659B5E'}>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Log In
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Field.Root required>
            <Field.Label>Email address</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Field.Root>

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
    </div>
    </>
  );
}
