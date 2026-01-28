// src/pages/TrailListPage.jsx
import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Alert,
  AlertDescription,
  Button,
  Flex,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { trailService } from "../services/trailService.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import TrailCard from "../components/Trails/TrailCard.jsx";
import TrailMap from "../components/Trails/TrailMap.jsx";
import ElevationGraph from "../components/Trails/ElevationGraph.jsx";

const TRAILS_PER_PAGE = 10;

export default function TrailListPage() {
  const [allTrails, setAllTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadTrails();
  }, []);

  const loadTrails = async () => {
    try {
      setLoading(true);
      setError(null);
      const trailsData = await trailService.getAllTrails();

      // Sort by newest first (createdAt descending)
      const sortedTrails = trailsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setAllTrails(sortedTrails);
    } catch (error) {
      console.error("Error loading trails:", error);
      setError("Failed to load trails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrailSelect = (trail) => {
    if (selectedTrail?.id === trail.id) {
      setSelectedTrail(null);
    } else {
      setSelectedTrail(trail);
    }
  };

  const handleCloseMap = () => {
    setSelectedTrail(null);
  };

  // Calculate pagination
  const totalPages = Math.ceil(allTrails.length / TRAILS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRAILS_PER_PAGE;
  const endIndex = startIndex + TRAILS_PER_PAGE;
  const currentTrails = allTrails.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    setSelectedTrail(null); // Close map when changing pages
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
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
      <Box p={4} w="100%" maxW="100vw">
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <Box>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              Trails
            </Text>
            <Text color="gray.600">
              {allTrails.length} trail{allTrails.length !== 1 ? "s" : ""} total
              {allTrails.length > TRAILS_PER_PAGE && (
                <span>
                  {" "}
                  • Showing {startIndex + 1}-
                  {Math.min(endIndex, allTrails.length)}
                </span>
              )}
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

          {!loading && !error && allTrails.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text fontSize="lg" color="gray.600">
                No trails saved yet. Create your first trail!
              </Text>
            </Box>
          )}

          {!loading && !error && allTrails.length > 0 && (
            <>
              {/* Trail Cards - Full Width */}
              <VStack align="stretch" spacing={3}>
                {currentTrails.map((trail) => (
                  <Box key={trail.id}>
                    <TrailCard
                      trail={trail}
                      onClick={() => handleTrailSelect(trail)}
                      isSelected={selectedTrail?.id === trail.id}
                    />

                    
                  </Box>
                ))}
              </VStack>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Box borderTop="1px solid" borderColor="gray.200" pt={4} mt={4}>
                  <Flex justify="space-between" align="center">
                    <Button
                      size="sm"
                      leftIcon={<ChevronLeft size={16} />}
                      onClick={goToPrevPage}
                      isDisabled={currentPage === 1}
                      variant="Ghost"
                    >
                      Previous
                    </Button>

                    <HStack spacing={2}>
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          // Show current page, first, last, and pages around current
                          const shouldShow =
                            page === 2 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 2;

                          if (!shouldShow) {
                            // Show ellipsis for gaps
                            if (
                              page === currentPage - 3 ||
                              page === currentPage + 3
                            ) {
                              return (
                                <Text key={page} fontSize="sm">
                                  ...
                                </Text>
                              );
                            }
                            return null;
                          }

                          return (
                            <Button
                              key={page}
                              size="sm"
                              variant={currentPage === page ? "solid" : "unstyled"}
                              colorScheme={
                                currentPage === page ? "red" : "gray"
                              }
                              onClick={() => goToPage(page)}
                              minW="8"
                            >
                              {page}
                            </Button>
                          );
                        },
                      )}
                    </HStack>

                    <Button
                      size="sm"
                      onClick={goToNextPage}
                      isDisabled={currentPage === totalPages}
                      variant="unstyled"
                    >
                      Next
                    </Button>
                  </Flex>

                  <Text
                    fontSize="xs"
                    color="gray.500"
                    textAlign="center"
                    mt={2}
                  >
                    Page {currentPage} of {totalPages}
                  </Text>
                </Box>
              )}
            </>
          )}
        </VStack>
      </Box>
    </>
  );
}
