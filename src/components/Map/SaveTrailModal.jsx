import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Textarea,
  Select,
  Field,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from '@chakra-ui/react';
import { Save } from 'lucide-react';
import { trailService } from '../../services/trailService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function SaveTrailModal({ 
  route, 
  routeStats, 
  isDisabled = false,
  onTrailSaved 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [trailName, setTrailName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');

  const { isAuthenticated } = useAuth();

  const handleSave = async () => {
    if (!route || !routeStats) {
      setError('No route data available');
      return;
    }

    if (!trailName.trim()) {
      setError('Trail name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert route to waypoints
      const waypoints = trailService.convertRouteToWaypoints(route);
      
      // Prepare trail data
      const trailData = {
        name: trailName.trim(),
        description: description.trim() || null,
        lengthKm: routeStats.lengthKm,
        heightKm: routeStats.heightKm,
        difficulty: difficulty,
        waypoints: waypoints
      };

      console.log('Saving trail:', trailData);

      const savedTrail = await trailService.createTrail(trailData);
      
      console.log('Trail saved successfully:', savedTrail);
      
      // Reset form and close modal
      setTrailName('');
      setDescription('');
      setDifficulty('EASY');
      setIsOpen(false);
      
      // Notify parent component
      onTrailSaved?.(savedTrail);
      
    } catch (error) {
      console.error('Error saving trail:', error);
      
      if (error.response?.status === 401) {
        setError('Please log in to save trails');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to save trail. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setTrailName('');
    setDescription('');
    setDifficulty('EASY');
  };

  if (!isAuthenticated) {
    return (
      <Button disabled variant="outline" size="sm">
        Login to Save Trail
      </Button>
    );
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          leftIcon={<Save size={16} />}
          colorScheme="green"
          size="sm"
          disabled={isDisabled || !route}
        >
          Save Trail
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Your Trail</DialogTitle>
        </DialogHeader>
        
        <DialogBody>
          <VStack spacing={4}>
            {routeStats && (
              <Box p={3} bg="gray.50" borderRadius="md" width="100%">
                <Text fontSize="sm" color="gray.600">
                  <strong>Route Stats:</strong> {routeStats.lengthKm} km • 
                  ↗ {Math.round(routeStats.heightKm * 1000)} m • 
                  {routeStats.durationMinutes} min
                </Text>
              </Box>
            )}

            <Field.Root>
              <Field.Label>Trail Name *</Field.Label>
              <Input
                value={trailName}
                onChange={(e) => setTrailName(e.target.value)}
                placeholder="Enter trail name..."
                disabled={loading}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your trail (optional)..."
                rows={3}
                disabled={loading}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Difficulty</Field.Label>
              <Select.Root value={difficulty} onValueChange={setDifficulty}>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="EASY">Easy</Select.Item>
                  <Select.Item value="MEDIUM">Medium</Select.Item>
                  <Select.Item value="HARD">Hard</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Root>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
          </VStack>
        </DialogBody>
        
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
          </DialogActionTrigger>
          
          <Button
            colorScheme="green"
            onClick={handleSave}
            isLoading={loading}
            loadingText="Saving..."
            disabled={!trailName.trim()}
          >
            Save Trail
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}