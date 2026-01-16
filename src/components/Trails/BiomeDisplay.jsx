// src/components/Trails/BiomeDisplay.jsx
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { Trees } from 'lucide-react';

// Colors for different biome types
const getBiomeColor = (biomeType) => {
  const colors = {
    zimzelena: '#306349',    // Dark green - Evergreen
    listopadna: '#DD6B20',   // Orange - Deciduous
    livade: '#65d661',       // Yellow - Grassland
    urbano: '#718096',       // Gray - Urban
    polja: '#f6df14',        // Brown - Fields
    vode: '#2f7bc2',         // Blue - Water
  };
  return colors[biomeType] || '#A0AEC0';
};

// Human-readable biome names
const getBiomeName = (biomeType) => {
  const names = {
    zimzelena: '🌲 Evergreen',
    listopadna: '🍂 Deciduous',
    livade: '🌾 Grassland',
    urbano: '🏘️ Urban',
    polja: '🌾 Fields',
    vode: '💧 Water',
    nepoznato: '❓ Unknown'
  };
  return names[biomeType] || biomeType;
};

export default function BiomeDisplay({ biomes }) {
  if (!biomes) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get ALL biomes for the proportional bar
  const getAllBiomes = () => {
  const biomeTypes = ['zimzelena', 'listopadna', 'livade', 'urbano', 'polja', 'vode'];
  
  return biomeTypes
    .map(type => ({ 
      type, 
      percentage: biomes[`${type}Percentage`] 
    }))
    .filter(biome => biome.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);
};

  // Get significant biomes (> 5%) for the text list
  const getSignificantBiomes = () => {
  const biomeTypes = ['zimzelena', 'listopadna', 'livade', 'urbano', 'polja', 'vode'];
  
  return biomeTypes
    .map(type => ({ 
      type, 
      percentage: biomes[`${type}Percentage`] 
    }))
    .filter(biome => biome.percentage > 5)
    .sort((a, b) => b.percentage - a.percentage);
};

  const allBiomes = getAllBiomes();
  const significantBiomes = getSignificantBiomes();

  return (
    <VStack align="stretch" spacing={2} pt={2} borderTop="1px solid" borderColor="gray.200">
      <HStack justify="space-between" fontSize="xs" color="green.700">
        <HStack spacing={1}>
          <Trees size={14} />
          <Text fontWeight="medium">Biome Analysis</Text>
        </HStack>
        <Badge colorScheme="green" size="xs">
          {getBiomeName(biomes.dominantBiome)}
        </Badge>
      </HStack>

      {/* Proportional Biome Bar */}
      {allBiomes.length > 0 && (
        <HStack gap={0} width="100%" height="20px" borderRadius="md" overflow="hidden">
          {allBiomes.map((biome) => (
            <Box
              key={biome.type}
              width={`${biome.percentage}%`}
              height="100%"
              bg={getBiomeColor(biome.type)}
              title={`${getBiomeName(biome.type)}: ${biome.percentage}%`}
              transition="all 0.2s"
              _hover={{
                opacity: 0.8
              }}
            />
          ))}
        </HStack>
      )}

      {/* Show top biomes with just text */}
      {significantBiomes.length > 0 && (
        <VStack align="stretch" spacing={1}>
          {significantBiomes.slice(0, 3).map((biome) => (
            <HStack key={biome.type} justify="space-between" fontSize="xs">
              <Text color="gray.600">{getBiomeName(biome.type)}</Text>
              <Text fontWeight="medium" color="green.600">
                {biome.percentage}%
              </Text>
            </HStack>
          ))}
        </VStack>
      )}

      {biomes.analyzedAt && (
        <Text fontSize="xs" color="gray.400">
          Analyzed: {formatDate(biomes.analyzedAt)}
        </Text>
      )}
    </VStack>
  );
}