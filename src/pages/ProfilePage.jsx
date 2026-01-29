// src/pages/EditProfilePage.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  Alert,
  AlertDescription,
  Field,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/authService.js';
import Navbar from '../components/Navbar.jsx';
import { User, Mail, Lock, Trash2 } from 'lucide-react';

export default function EditProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords match if changing password
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    // Check if current password is provided when changing email or password
    if ((formData.email !== user.email || formData.newPassword) && !formData.currentPassword) {
      setError('Current password is required to change email or password');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      };

      await userService.updateProfile(updateData);
      
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));

      // If email changed, logout and redirect to login
      if (formData.email !== user.email) {
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await userService.deleteAccount();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box p={8} maxW="600px" mx="auto">
        <VStack align="stretch" spacing={6}>
          <Heading size="lg" color="gray.800">Edit Profile</Heading>

          {error && (
            <Alert status="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert status="success">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <VStack align="stretch" spacing={4}>
              {/* Full Name */}
              <Field.Root>
                <Field.Label>
                  <HStack spacing={2}>
                    <User size={16} />
                    <Text>Full Name</Text>
                  </HStack>
                </Field.Label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  isDisabled={loading}
                />
              </Field.Root>

              {/* Email */}
              <Field.Root>
                <Field.Label>
                  <HStack spacing={2}>
                    <Mail size={16} />
                    <Text>Email</Text>
                  </HStack>
                </Field.Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  isDisabled={loading}
                />
                {formData.email !== user?.email && (
                  <Text fontSize="xs" color="orange.600" mt={1}>
                    Changing your email will require you to log in again
                  </Text>
                )}
              </Field.Root>

              {/* Divider */}
              <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                  Change Password (Optional)
                </Text>
              </Box>

              {/* Current Password */}
              <Field.Root>
                <Field.Label>
                  <HStack spacing={2}>
                    <Lock size={16} />
                    <Text>Current Password</Text>
                  </HStack>
                </Field.Label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Required to change email or password"
                  isDisabled={loading}
                />
              </Field.Root>

              {/* New Password */}
              <Field.Root>
                <Field.Label>New Password</Field.Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  isDisabled={loading}
                />
              </Field.Root>

              {/* Confirm New Password */}
              {formData.newPassword && (
                <Field.Root>
                  <Field.Label>Confirm New Password</Field.Label>
                  <Input
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                    isDisabled={loading}
                  />
                </Field.Root>
              )}

              {/* Save Button */}
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Saving..."
                mt={4}
              >
                Save Changes
              </Button>
            </VStack>
          </form>

          {/* Danger Zone */}
          <Box 
            borderTop="2px solid" 
            borderColor="red.200" 
            pt={6} 
            mt={6}
          >
            <VStack align="stretch" spacing={3}>
              <Heading size="sm" color="red.600">Danger Zone</Heading>
              <Text fontSize="sm" color="gray.600">
                Once you delete your account, there is no going back. Please be certain.
              </Text>
              <Button
                leftIcon={<Trash2 size={16} />}
                colorScheme="red"
                variant="outline"
                onClick={handleDeleteAccount}
                isDisabled={loading}
              >
                Delete Account
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </>
  );
}