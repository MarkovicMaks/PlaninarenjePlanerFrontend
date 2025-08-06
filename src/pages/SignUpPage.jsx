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
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!fullName || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await signup({
        fullName,
        email,
        password,
      });
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle different error types
      if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid data provided');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Email address</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  disabled={loading}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Confirm Password</Field.Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re‑enter your password"
                  disabled={loading}
                />
              </Field.Root>

              {error && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              )}

              <Button 
                type="submit" 
                colorScheme="teal" 
                width="full"
                isLoading={loading}
                loadingText="Creating account..."
              >
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