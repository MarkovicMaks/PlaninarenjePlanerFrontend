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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trailService } from "../services/trailService.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import TrailCard from "../components/Trails/TrailCard.jsx";
import TrailFilters from "../components/TrailFilters.jsx";

const TRAILS_PER_PAGE = 10;

export default function TrailListPage() {
  const [allTrails, setAllTrails] = useState([]);
  const [filteredTrails, setFilteredTrails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBiome, setSelectedBiome] = useState("");
  const [minLength, setMinLength] = useState(0);
  const [maxLength, setMaxLength] = useState(50);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadTrails();
  }, []);

  // Filter trails when search query, biome, or length changes
  useEffect(() => {
    let filtered = allTrails;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trail =>
        trail.name.toLowerCase().includes(query) ||
        trail.description?.toLowerCase().includes(query) ||
        trail.createdBy?.fullName?.toLowerCase().includes(query)
      );
    }

    // Filter by biome (dominant biome must match)
    if (selectedBiome) {
      filtered = filtered.filter(trail => 
        trail.biomes?.dominantBiome === selectedBiome
      );
    }

    // Filter by length range
    filtered = filtered.filter(trail => {
      const length = parseFloat(trail.lengthKm);
      return length >= minLength && (maxLength === 50 ? true : length <= maxLength);
    });

    setFilteredTrails(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, selectedBiome, minLength, maxLength, allTrails]);

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
      setFilteredTrails(sortedTrails);
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

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBiome("");
    setMinLength(0);
    setMaxLength(50);
  };

  // Calculate pagination based on filtered trails
  const totalPages = Math.ceil(filteredTrails.length / TRAILS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRAILS_PER_PAGE;
  const endIndex = startIndex + TRAILS_PER_PAGE;
  const currentTrails = filteredTrails.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    setSelectedTrail(null);
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
      <Box display="flex" flexDirection="column" height="100vh">
        <Navbar />
        <Box p={8} textAlign="center">
          <Text fontSize="lg" color="gray.600">
            Please log in to view saved trails.
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      <Navbar />
      
      {/* Scrollable content area */}
      <Box 
        flex="1" 
        overflowY="auto" 
        p={4}
      >
        <VStack align="stretch" spacing={6} maxW="100%" mx="auto">
          {/* Header - scrolls away with content */}
          <Box>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              Trails
            </Text>
            <Text color="gray.600">
              {filteredTrails.length} trail{filteredTrails.length !== 1 ? "s" : ""} 
              {(searchQuery || selectedBiome) && " found"}
              {filteredTrails.length > TRAILS_PER_PAGE && (
                <span>
                  {" "}
                  • Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredTrails.length)}
                </span>
              )}
            </Text>
          </Box>

          {/* Trail Filters */}
          <Box>
            <TrailFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchClear={clearSearch}
              selectedBiome={selectedBiome}
              onBiomeChange={setSelectedBiome}
              minLength={minLength}
              maxLength={maxLength}
              onLengthRangeChange={([min, max]) => {
                setMinLength(min);
                setMaxLength(max);
              }}
              searchPlaceholder="Search trails by name, description, or creator..."
            />
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

          {!loading && !error && filteredTrails.length === 0 && allTrails.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text fontSize="lg" color="gray.600">
                No trails saved yet. Create your first trail!
              </Text>
            </Box>
          )}

          {!loading && !error && filteredTrails.length === 0 && allTrails.length > 0 && (
            <Box textAlign="center" py={8}>
              <Text fontSize="lg" color="gray.600" mb={2}>
                No trails found with current filters
              </Text>
              <Button mt={4} onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </Box>
          )}

          {!loading && !error && filteredTrails.length > 0 && (
            <>
              {/* Trail Cards */}
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
                      disabled={currentPage === 1}
                      variant="Ghost"
                    >
                      Previous
                    </Button>

                    <HStack spacing={2}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          const shouldShow =
                            page === 2 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 2;

                          if (!shouldShow) {
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
                      disabled={currentPage === totalPages}
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
    </Box>
  );
}