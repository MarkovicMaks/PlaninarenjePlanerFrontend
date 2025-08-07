import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import SaveTrailModal from './SaveTrailModal.jsx';

function MapInfo({ routeInfo, currentRoute, onClearAfterSave }) {
  const handleTrailSaved = (savedTrail) => {
    // Simple alert as before
    alert(`Trail "${savedTrail.name}" saved successfully!`);
    
    // Clear the map after saving
    onClearAfterSave?.();
  };

  // Check if we have elevation data
  const hasElevationData = currentRoute?.properties?.elevationData?.length > 0;

  return (
    <Box className="MapInfo" p={4} bg="white" shadow="md" borderRadius="md" m={4}>
      {routeInfo ? (
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold">
            Distance: {routeInfo.distanceKm} km • ↗︎ {routeInfo.ascendM} m • 
            ↘︎ {routeInfo.descendM} m • Duration: {routeInfo.durationMin} min
          </Text>
          
          {hasElevationData && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box w={2} h={2} bg="green.400" borderRadius="full" />
              <Text fontSize="xs" color="green.600" fontWeight="medium">
                3D Elevation Data Available
              </Text>
            </Box>
          )}
          
          <HStack justify="center">
            <SaveTrailModal
              route={currentRoute}
              routeStats={{
                lengthKm: parseFloat(routeInfo.distanceKm),
                heightKm: routeInfo.ascendM / 1000, // Convert to km
                durationMinutes: routeInfo.durationMin
              }}
              onTrailSaved={handleTrailSaved}
              onClearAfterSave={onClearAfterSave}
            />
          </HStack>
        </VStack>
      ) : (
        <Text fontSize="lg" textAlign="center" color="gray.500">
          Click on the map to start creating a route
        </Text>
      )}
    </Box>
  );
}

export default MapInfo;