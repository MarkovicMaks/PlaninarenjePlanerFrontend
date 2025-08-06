// src/components/Map/MapControls.jsx
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { MapPin, Route, Trash2 } from 'lucide-react';

export default function MapControls({ 
  waypointsCount = 0, 
  onCreateRoute, 
  onClearWaypoints,
  isCreatingRoute = false 
}) {
  return (
    <Box 
      position="absolute" 
      top={4} 
      right={4} 
      zIndex={1000} 
      bg="white" 
      p={4} 
      borderRadius="md" 
      shadow="lg"
    >
      <HStack spacing={4} align="center">
        <HStack spacing={2} align="center">
          <MapPin size={16} />
          <Text fontSize="sm" fontWeight="medium">
            {waypointsCount} waypoint{waypointsCount !== 1 ? 's' : ''}
          </Text>
        </HStack>

        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<Route size={16} />}
          onClick={onCreateRoute}
          isDisabled={waypointsCount < 2}
          isLoading={isCreatingRoute}
          loadingText="Creating..."
        >
          Create Route
        </Button>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Trash2 size={16} />}
          onClick={onClearWaypoints}
          isDisabled={waypointsCount === 0}
        >
          Clear
        </Button>
      </HStack>
    </Box>
  );
}