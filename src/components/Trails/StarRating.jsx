import { HStack, Box, Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, totalRatings, size = 'sm', showCount = true }) {
  if (rating === null || rating === undefined) {
    return (
      <HStack spacing={1} fontSize={size}>
        <Text color="gray.500" fontSize={size}>No ratings yet</Text>
      </HStack>
    );
  }

  const starSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <HStack spacing={1}>
      {[...Array(5)].map((_, index) => {
        const isFilled = index < fullStars;
        const isHalf = index === fullStars && hasHalfStar;

        return (
          <Box key={index} position="relative">
            <Star
              size={starSize}
              fill={isFilled || isHalf ? '#ECC94B' : 'none'}
              stroke={isFilled || isHalf ? '#ECC94B' : '#CBD5E0'}
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
      
      {showCount && totalRatings > 0 && (
        <Text fontSize={size} color="gray.600" ml={1}>
          ({rating.toFixed(1)}) {totalRatings}
        </Text>
      )}
    </HStack>
  );
}