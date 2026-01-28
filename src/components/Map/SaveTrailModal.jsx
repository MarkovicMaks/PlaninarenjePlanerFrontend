// src/components/Map/SaveTrailModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Input, VStack, Text, Textarea } from "@chakra-ui/react";
import { Save, X } from "lucide-react";
import { trailService } from "../../services/trailService.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function SaveTrailModal({
  route,
  routeStats,
  isDisabled = false,
  onTrailSaved,
  onClearAfterSave,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [trailName, setTrailName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = () => {
    setTrailName("");
    setDescription("");
    setDifficulty("EASY");
    setError(null);
  };

  const handleOpen = () => {
    if (!route || !routeStats) return;
    setIsOpen(true);
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (!route || !routeStats) {
      setError("No route data available");
      return;
    }

    if (!trailName.trim()) {
      setError("Trail name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const waypoints = trailService.convertRouteToWaypoints(route);

      const trailData = {
        name: trailName.trim(),
        description: description.trim() || null,
        lengthKm: routeStats.lengthKm,
        heightKm: routeStats.heightKm,
        difficulty,
        waypoints,
      };

      console.log("Saving trail:", trailData);

      const savedTrail = await trailService.createTrail(trailData);
      console.log("Trail saved successfully:", savedTrail);

      onTrailSaved?.(savedTrail);
      onClearAfterSave?.();

      handleClose();
    } catch (err) {
      console.error("Error saving trail:", err);
      if (err.response?.status === 401) {
        setError("Please log in to save trails");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to save trail. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button isDisabled variant="outline" size="sm">
        Login to Save Trail
      </Button>
    );
  }

  // Trigger button inside MapInfo
  const triggerButton = (
    <Button
      leftIcon={<Save size={16} />}
      colorScheme="green"
      size="sm"
      onClick={handleOpen}
      isDisabled={isDisabled || !route}
    >
      Save Trail
    </Button>
  );

  // If portal target not ready yet, just render the button
  if (!mounted) {
    return triggerButton;
  }

  return (
    <>
      {triggerButton}

      {isOpen &&
        createPortal(
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999} // very high, above map / controls
            onClick={handleClose} // click backdrop to close
          >
            <Box
              bg="white"
              borderRadius="md"
              p={6}
              maxW="500px"
              w="90%"
              boxShadow="2xl"
              onClick={(e) => e.stopPropagation()} // don't close when clicking inside
            >
              <VStack align="stretch" spacing={4}>
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Napravi novi trail
                  </Text>
                </Box>

                {/* Route stats */}
                {routeStats && (
                  <Box p={3} bg="gray.50" borderRadius="md" w="100%">
                    <Text fontSize="sm" color="gray.600">
                      <strong>Route Stats:</strong> {routeStats.lengthKm} km • ↗{" "}
                      {Math.round(routeStats.heightKm * 1000)} m •{" "}
                      {routeStats.durationMinutes} min
                    </Text>
                  </Box>
                )}

                {/* Trail name */}
                <Box>
                  <Text fontSize="sm" mb={1} fontWeight="medium">
                    Trail Name *
                  </Text>
                  <Input
                    value={trailName}
                    onChange={(e) => setTrailName(e.target.value)}
                    placeholder="Enter trail name"
                    isDisabled={loading}
                  />
                </Box>

                {/* Description */}
                <Box>
                  <Text fontSize="sm" mb={1} fontWeight="medium">
                    Description
                  </Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your trail (optional)"
                    rows={3}
                    isDisabled={loading}
                  />
                </Box>

                {/* Difficulty */}
                <Box>
                  <Text fontSize="sm" mb={1} fontWeight="medium">
                    Difficulty
                  </Text>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                    }}
                    disabled={loading}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </Box>

                {/* Error */}
                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}

                {/* Actions */}
                <Box display="flex" justifyContent="flex-end" gap={2} pt={2}>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    isDisabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={handleSave}
                    isLoading={loading}
                    loadingText="Saving..."
                    isDisabled={!trailName.trim()}
                  >
                    Save Trail
                  </Button>
                </Box>
              </VStack>
            </Box>
          </Box>,
          document.body
        )}
    </>
  );
}
