// src/components/Trails/TrailExpandedMapSection.jsx
import { Box, HStack, VStack, Text, Button } from "@chakra-ui/react";
import { X } from "lucide-react";
import TrailMap from "./TrailMap.jsx";
import ElevationGraph from "./ElevationGraph.jsx";

const defaultFormatDate = (dateString) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("hr-HR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function TrailExpandedMapSection({
  trail,
  onClose,
  formatDate = defaultFormatDate,
}) {
  if (!trail) return null;

  const {
    name,
    lengthKm,
    waypoints,
    totalAscent,
    totalDescent,
    minElevation,
    maxElevation,
    createdAt,
  } = trail;

  return (
    <Box
      mt={3}
      p={4}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <HStack justify="space-between" mb={3}>
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="bold">
            {name}
          </Text>
          
        </VStack>

        <Button
          size="sm"
          leftIcon={<X size={16} />}
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          Close Map
        </Button>
      </HStack>

      {/* Elevation Graph */}
      {minElevation !== null &&
        maxElevation !== null &&
        typeof minElevation !== "undefined" &&
        typeof maxElevation !== "undefined" && (
          <Box mb={3}>
            <ElevationGraph
              waypoints={waypoints}
              totalAscent={totalAscent}
              totalDescent={totalDescent}
            />
          </Box>
        )}

      {/* Map */}
      <Box height="500px" borderRadius="md" overflow="hidden">
        <TrailMap trail={trail} />
      </Box>

      <Text fontSize="xs" color="gray.500" mt={2}>
        Created: {formatDate(createdAt)}
      </Text>
    </Box>
  );
}
