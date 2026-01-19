// src/components/Trails/TrailCard.jsx
import { useState } from 'react';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { MapPin, Clock, TrendingUp, TrendingDown, Mountain } from 'lucide-react';
import BiomeDisplay from './BiomeDisplay';
import ElevationGraph from './ElevationGraph';
import InteractiveStarRating from './InteractiveStarRating';
import { trailService } from '../../services/trailService';
import { useAuth } from '../../contexts/AuthContext';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'EASY': return 'green';
    case 'MEDIUM': return 'yellow';
    case 'HARD': return 'red';
    default: return 'gray';
  }
};

export default function TrailCard({ trail, onClick, isSelected = false, onRatingChange }) {
  const { isAuthenticated } = useAuth();
  const [ratingStats, setRatingStats] = useState(trail.ratingStats);
  const [isRating, setIsRating] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const hasElevationData = trail.minElevation !== null && trail.maxElevation !== null;

  const handleRate = async (rating) => {
    if (isRating) return; // Prevent double-clicking
    
    setIsRating(true);
    try {
      const newStats = await trailService.rateTrail(trail.id, rating);
      setRatingStats(newStats);
      
      // Notify parent component if needed
      onRatingChange?.(trail.id, newStats);
      
      console.log(`Rated trail ${trail.id} with ${rating} stars`);
    } catch (error) {
      console.error('Failed to rate trail:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsRating(false);
    }
  };

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on stars
    if (e.target.closest('.star-rating-container')) {
      e.stopPropagation();
      return;
    }
    onClick?.();
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
      onClick={handleCardClick}
      _hover={{
        shadow: 'md',
        bg: isSelected ? 'blue.100' : 'gray.50'
      }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        {/* Trail Name and Difficulty */}
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800" noOfLines={1}>
              {trail.name}
            </Text>
            
            {/* Interactive Rating */}
            <Box 
              className="star-rating-container"
              onClick={(e) => e.stopPropagation()}
            >
              <InteractiveStarRating 
                rating={ratingStats?.averageRating}
                totalRatings={ratingStats?.totalRatings || 0}
                userRating={ratingStats?.userRating}
                onRate={handleRate}
                isAuthenticated={isAuthenticated}
                size="sm"
              />
            </Box>
          </VStack>
          
          <Badge colorScheme={getDifficultyColor(trail.difficulty)} size="sm">
            {trail.difficulty}
          </Badge>
        </HStack>

        {/* Basic Trail Stats */}
        <HStack spacing={4} fontSize="sm" color="gray.600">
          <HStack spacing={1}>
            <MapPin size={16} />
            <Text>{trail.lengthKm} km</Text>
          </HStack>
          
          <HStack spacing={1}>
            <Clock size={16} />
            <Text>{trail.waypoints?.length || 0} points</Text>
          </HStack>
          
          {/* Show elevation range in basic stats */}
          {hasElevationData && (
            <HStack spacing={1}>
              <Mountain size={16} />
              <Text>{Math.round(trail.minElevation)}m - {Math.round(trail.maxElevation)}m</Text>
            </HStack>
          )}
          
          {/* Show total ascent for non-elevation data trails */}
          {!hasElevationData && (
            <HStack spacing={1}>
              <TrendingUp size={16} />
              <Text>↗ {Math.round(trail.heightKm * 1000)}m</Text>
            </HStack>
          )}
        </HStack>

        {/* Biome Analysis Component */}
        <BiomeDisplay biomes={trail.biomes} />

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