// src/pages/TrailListPage.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Spinner, 
  Alert,
  AlertDescription,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { trailService } from '../services/trailService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import TrailCard from '../components/Trails/TrailCard.jsx';
import TrailMap from '../components/Trails/TrailMap.jsx';

export default function TrailListPage() {
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadTrails();
  }, []);

  const loadTrails = async () => {
    try {
      setLoading(true);
      setError(null);
      const trailsData = await trailService.getAllTrails();
      setTrails(trailsData);
      
      // Auto-select first trail if available
      if (trailsData.length > 0) {
        setSelectedTrail(trailsData[0]);
      }
    } catch (error) {
      console.error('Error loading trails:', error);
      setError('Failed to load trails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrailSelect = (trail) => {
    setSelectedTrail(trail);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <Box p={8} textAlign="center">
          <Text fontSize="lg" color="gray.600">
            Please log in to view saved trails.
          </Text>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box p={4}>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Your Saved Trails
            </Text>
            <Text color="gray.600">
              {trails.length} trail{trails.length !== 1 ? 's' : ''} saved
            </Text>
          </Box>

          {loading && (
            <Box display="flex" justifyContent="center" py={8}>
              <VStack spacing={4}>
                <Spinner size="lg" color="blue.500" />
                <Text>Loading trails...</Text>
              </VStack>
            </Box>
          )}

          {error && (
            <Alert status="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && trails.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text fontSize="lg" color="gray.600">
                No trails saved yet. Create your first trail!
              </Text>
            </Box>
          )}

          {!loading && !error && trails.length > 0 && (
            <Grid templateColumns={{ base: '1fr', lg: '400px 1fr' }} gap={6} height="70vh">
              {/* Trail List */}
              <GridItem>
                <VStack align="stretch" spacing={3} height="100%" overflowY="auto" pr={2}>
                  {trails.map((trail) => (
                    <TrailCard
                      key={trail.id}
                      trail={trail}
                      onClick={() => handleTrailSelect(trail)}
                      isSelected={selectedTrail?.id === trail.id}
                    />
                  ))}
                </VStack>
              </GridItem>

              {/* Trail Map */}
              <GridItem>
                <Box height="100%" bg="gray.100" borderRadius="md" overflow="hidden">
                  {selectedTrail ? (
                    <>
                      <Box p={4} bg="white" borderBottom="1px solid" borderColor="gray.200">
                        <VStack align="stretch" spacing={2}>
                          <Text fontSize="xl" fontWeight="bold">
                            {selectedTrail.name}
                          </Text>
                          <HStack spacing={6} fontSize="sm" color="gray.600">
                            <Text>📍 {selectedTrail.lengthKm} km</Text>
                            <Text>⛰️ ↗ {Math.round(selectedTrail.heightKm * 1000)}m</Text>
                            <Text>📌 {selectedTrail.waypoints?.length} waypoints</Text>
                          </HStack>
                          {selectedTrail.description && (
                            <Text fontSize="sm" color="gray.700">
                              {selectedTrail.description}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                      <Box height="calc(100% - 120px)">
                        <TrailMap trail={selectedTrail} />
                      </Box>
                    </>
                  ) : (
                    <Box 
                      height="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                    >
                      <Text color="gray.600">Select a trail to view on map</Text>
                    </Box>
                  )}
                </Box>
              </GridItem>
            </Grid>
          )}
        </VStack>
      </Box>
    </>
  );
}