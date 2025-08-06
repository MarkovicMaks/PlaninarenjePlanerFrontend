// src/components/Trails/TrailCard.jsx
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { MapPin, Clock, TrendingUp } from 'lucide-react';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'EASY': return 'green';
    case 'MEDIUM': return 'yellow';
    case 'HARD': return 'red';
    default: return 'gray';
  }
};

export default function TrailCard({ trail, onClick, isSelected = false }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box
      p={4}
      bg={isSelected ? 'blue.50' : 'white'}
      border={isSelected ? '2px solid' : '1px solid'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      borderRadius="md"
      shadow={isSelected ? 'lg' : 'sm'}
      cursor="pointer"
      onClick={onClick}
      _hover={{
        shadow: 'md',
        bg: isSelected ? 'blue.100' : 'gray.50'
      }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        {/* Trail Name and Difficulty */}
        <HStack justify="space-between" align="start">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {trail.name}
          </Text>
          <Badge colorScheme={getDifficultyColor(trail.difficulty)} size="sm">
            {trail.difficulty}
          </Badge>
        </HStack>

        {/* Trail Stats */}
        <HStack spacing={4} fontSize="sm" color="gray.600">
          <HStack spacing={1}>
            <MapPin size={16} />
            <Text>{trail.lengthKm} km</Text>
          </HStack>
          
          <HStack spacing={1}>
            <TrendingUp size={16} />
            <Text>↗ {Math.round(trail.heightKm * 1000)}m</Text>
          </HStack>
          
          <HStack spacing={1}>
            <Clock size={16} />
            <Text>{trail.waypoints?.length || 0} points</Text>
          </HStack>
        </HStack>

        {/* Description */}
        {trail.description && (
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {trail.description}
          </Text>
        )}

        {/* Created Date */}
        <Text fontSize="xs" color="gray.500">
          Created: {formatDate(trail.createdAt)}
        </Text>
      </VStack>
    </Box>
  );
}