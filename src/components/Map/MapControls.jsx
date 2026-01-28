// src/components/Map/MapControls.jsx
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { MapPin, Trash2 } from "lucide-react";
import SaveTrailModal from "./SaveTrailModal.jsx";

export default function MapControls({
  waypointsCount = 0,
  onClearWaypoints,
  routeInfo,
  currentRoute,
  onTrailSaved,
}) {
  const hasRoute = !!routeInfo && !!currentRoute;

  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      zIndex={1000}
      bg="var(--card-bg)"
      p={4}
      borderRadius="md"
      shadow="lg"
    >
      <HStack spacing={4} align="center">
        
        <HStack spacing={2} align="center">
          <MapPin size={16} />
          <Text fontSize="sm" fontWeight="medium" color={"gray.700"}>
            {waypointsCount} waypoint{waypointsCount !== 1 ? "s" : ""}
          </Text>
        </HStack>

        {/* Save Trail button (opens modal) */}
        <SaveTrailModal
          route={currentRoute}
          routeStats={
            routeInfo
              ? {
                  lengthKm: parseFloat(routeInfo.distanceKm),
                  heightKm: routeInfo.ascendM / 1000, // m → km
                  durationMinutes: routeInfo.durationMin,
                }
              : null
          }
          isDisabled={!hasRoute}
          onTrailSaved={onTrailSaved}
          onClearAfterSave={onClearWaypoints}
        />

        {/* Clear button */}
        <Button
          size="sm"
          onClick={onClearWaypoints}
          isDisabled={waypointsCount === 0}
        >
          Clear
        </Button>
      </HStack>
    </Box>
  );
}
