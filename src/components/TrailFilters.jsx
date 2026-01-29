// src/components/TrailFilters.jsx
import { Box, HStack, VStack, Button, Text } from "@chakra-ui/react";
import { Slider } from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@chakra-ui/react";
import SearchBar from "./SearchBar.jsx";
import { Filter, ChevronDown, Ruler } from "lucide-react";

const biomeOptions = [
  { value: "", label: "All Biomes", emoji: "" },
  { value: "zimzelena", label: "Evergreen Forest", emoji: "" },
  { value: "listopadna", label: "Deciduous Forest", emoji: "" },
  { value: "livade", label: "Grassland", emoji: "" },
  { value: "urbano", label: "Urban", emoji: "" },
  { value: "polja", label: "Fields", emoji: "" },
];

export default function TrailFilters({
  searchQuery,
  onSearchChange,
  onSearchClear,
  selectedBiome,
  onBiomeChange,
  minLength,
  maxLength,
  onLengthRangeChange,
  searchPlaceholder = "Search trails...",
}) {
  const selectedBiomeLabel =
    biomeOptions.find((b) => b.value === selectedBiome)?.label || "All Biomes";
  const selectedBiomeEmoji =
    biomeOptions.find((b) => b.value === selectedBiome)?.emoji || "";

  return (
    <VStack align="stretch" spacing={3}>
      {/* Search Bar */}

      <HStack spacing={4} flexWrap="wrap" align="start" width="100%">
        {/* Biome Filter Dropdown */}
        <HStack spacing={3} align="center" width="100%">
          <Box color="gray.500">
            <Filter size={18} />
          </Box>

          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onSearchClear}
            placeholder={searchPlaceholder}
            
          />

          <Box position="relative" >
            <MenuRoot>
              <MenuTrigger asChild>
                <Button variant="outline" size="md" px={4} py={2} width={"200px"}>
                  <HStack spacing={2}>
                    <Text>
                      {selectedBiomeEmoji} {selectedBiomeLabel}
                    </Text>
                    <ChevronDown size={16} />
                  </HStack>
                </Button>
              </MenuTrigger>

              <MenuContent
                minW="220px"
                bg="white"
                shadow="lg"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                p={1}
                zIndex={1000}
                position="absolute"
                mt="10px"
              >
                {biomeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    onClick={() => onBiomeChange(option.value)}
                    px={3}
                    py={2}
                    borderRadius="sm"
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    bg={
                      selectedBiome === option.value ? "gray.50" : "transparent"
                    }
                  >
                    <HStack spacing={2} width="100%">
                      <Text fontSize="sm">
                        {option.emoji} {option.label}
                      </Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuContent>
            </MenuRoot>
          </Box>

          
          <HStack spacing={3} align="center" flex="1" minW="350px">
            <Box color="gray.500">
              <Ruler size={18} />
            </Box>

            <VStack align="stretch" spacing={1} flex="1">
              <HStack justify="space-between" fontSize="sm" fontWeight="medium">
                <Text>{minLength} km</Text>
                <Text color="gray.600">Trail Length</Text>
                <Text>{maxLength === 50 ? "50+ km" : `${maxLength} km`}</Text>
              </HStack>

              <Slider.Root
                value={[minLength, maxLength]}
                min={0}
                max={50}
                step={0.5}
                minStepsBetweenThumbs={1}
                colorPalette={"green.fg"}
                onValueChange={(details) => onLengthRangeChange(details.value)}
              >
                <Slider.Control>
                  <Slider.Track >
                    <Slider.Range backgroundColor={"#659B5E"}/>
                  </Slider.Track>
                  <Slider.Thumbs
                  backgroundColor={"#659B5E"}
                  borderColor={"#556F44"} />
                </Slider.Control>
              </Slider.Root>
            </VStack>
          </HStack>
        </HStack>
      </HStack>
    </VStack>
  );
}
