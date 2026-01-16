// src/components/Trails/InteractiveStarRating.jsx
import { useState } from 'react';
import { HStack, VStack, Box, Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';

export default function InteractiveStarRating({ 
  rating, 
  totalRatings, 
  userRating,
  onRate,
  isAuthenticated = false,
  size = 'sm' 
}) {
  const [hoveredStar, setHoveredStar] = useState(null);

  const starSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;
  const displayRating = rating || 0;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;

  const handleStarClick = (starIndex) => {
    if (!isAuthenticated) return;
    const newRating = starIndex + 1;
    onRate?.(newRating);
  };

  const handleStarHover = (starIndex) => {
    if (!isAuthenticated) return;
    setHoveredStar(starIndex);
  };

  const handleMouseLeave = () => {
    setHoveredStar(null);
  };

  // Determine which stars should be filled
  const getStarFill = (index) => {
    // If hovering and authenticated, show hover state
    if (isAuthenticated && hoveredStar !== null) {
      return index <= hoveredStar;
    }
    
    // If user has rated, show their rating
    if (userRating !== null && userRating !== undefined) {
      return index < userRating;
    }
    
    // Otherwise show average rating
    return index < fullStars || (index === fullStars && hasHalfStar);
  };

  const getStarColor = (index) => {
    // If hovering and authenticated, show blue
    if (isAuthenticated && hoveredStar !== null && index <= hoveredStar) {
      return '#3182CE';
    }
    
    // If user has rated, show green
    if (userRating !== null && userRating !== undefined && index < userRating) {
      return '#38A169';
    }
    
    // Otherwise show yellow for average
    return '#ECC94B';
  };

  if (!isAuthenticated && (rating === null || rating === undefined)) {
    return (
      <HStack spacing={1} fontSize={size}>
        <Text color="gray.500" fontSize={size}>No ratings yet</Text>
      </HStack>
    );
  }

  return (
    <VStack align="start" spacing={1}>
      <HStack spacing={1} onMouseLeave={handleMouseLeave}>
        {[...Array(5)].map((_, index) => {
          const isFilled = getStarFill(index);
          const isHalf = !isAuthenticated && index === fullStars && hasHalfStar && hoveredStar === null && !userRating;
          const starColor = getStarColor(index);

          return (
            <Box 
              key={index} 
              position="relative"
              cursor={isAuthenticated ? 'pointer' : 'default'}
              onMouseEnter={() => handleStarHover(index)}
              onClick={() => handleStarClick(index)}
              transition="transform 0.1s"
              _hover={isAuthenticated ? { transform: 'scale(1.1)' } : {}}
            >
              <Star
                size={starSize}
                fill={isFilled ? starColor : 'none'}
                stroke={isFilled ? starColor : '#CBD5E0'}
                style={{ 
                  clipPath: isHalf ? 'inset(0 50% 0 0)' : 'none',
                }}
              />
              {isHalf && (
                <Star
                  size={starSize}
                  fill="none"
                  stroke="#CBD5E0"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    clipPath: 'inset(0 0 0 50%)',
                  }}
                />
              )}
            </Box>
          );
        })}
      </HStack>

      {/* Show rating info */}
      <HStack spacing={2} fontSize="xs">
        {userRating !== null && userRating !== undefined && (
          <Text color="green.600" fontWeight="medium">
            Your rating: {userRating} ⭐
          </Text>
        )}
        
        {rating !== null && rating !== undefined && totalRatings > 0 && (
          <Text color="gray.600">
            {rating.toFixed(1)} avg • {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
          </Text>
        )}
        
        {isAuthenticated && !userRating && (
          <Text color="blue.600" fontSize="xs">
            Click to rate
          </Text>
        )}
      </HStack>
    </VStack>
  );
}