import { Box, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import SaveTrailModal from './SaveTrailModal.jsx';

function MapInfo({ routeInfo, currentRoute }) {
  const toast = useToast();

  const handleTrailSaved = (savedTrail) => {
    toast({
      title: "Trail saved successfully!",
      description: `"${savedTrail.name}" has been saved to your trails.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box className="MapInfo" p={4} bg="white" shadow="md" borderRadius="md" m={4}>
      {routeInfo ? (
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold">
            Distance: {routeInfo.distanceKm} km • ↗︎ {routeInfo.ascendM} m • 
            ↘︎ {routeInfo.descendM} m • Duration: {routeInfo.durationMin} min
          </Text>
          
          <HStack justify="center">
            <SaveTrailModal
              route={currentRoute}
              routeStats={{
                lengthKm: parseFloat(routeInfo.distanceKm),
                heightKm: routeInfo.ascendM / 1000, // Convert to km
                durationMinutes: routeInfo.durationMin
              }}
              onTrailSaved={handleTrailSaved}
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