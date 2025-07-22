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

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // TODO: replace with real sign‑up logic (API call, etc.)
    if (name && email && password) {
      // pretend sign‑up succeeded
      navigate('/');
    } else {
      setError('All fields are required');
    }
  };

  return (
    <>
      <Navbar />
      <div className="SignupPage">
        <Box
          maxW="md"
          mx="auto"
          mt={12}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          background="#659B5E"
          width="60%"
        >
          <Heading as="h2" size="lg" textAlign="center" mb={6}>
            Sign Up
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Field.Root required>
                <Field.Label>Full Name</Field.Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </Field.Root>

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
                  placeholder="Enter a strong password"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Confirm Password</Field.Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re‑enter your password"
                />
              </Field.Root>

              {error && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              )}

              <Button type="submit" colorScheme="teal" width="full">
                Create Account
              </Button>

              <Text fontSize="sm">
                Already have an account?{' '}
                <Link color="teal.500" onClick={() => navigate('/login')}>
                  Log In
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </div>
    </>
  );
}
