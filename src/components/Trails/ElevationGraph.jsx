// src/components/Trails/ElevationGraph.jsx
import { Box, Text, HStack } from '@chakra-ui/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function ElevationGraph({ waypoints, totalAscent, totalDescent }) {
  if (!waypoints || waypoints.length === 0) return null;


  const waypointsWithElevation = waypoints.filter(wp => wp.elevation !== null && wp.elevation !== undefined);
  
  if (waypointsWithElevation.length === 0) return null;
  const sortedWaypoints = [...waypointsWithElevation].sort((a, b) => a.order - b.order);
  const elevations = sortedWaypoints.map(wp => wp.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const elevationRange = maxElevation - minElevation;

  // Graph dimensions
  const graphHeight = 80;
  const graphWidth = 100; // percentage

  // Calculate grid lines every 50m
  const getGridLines = () => {
    if (elevationRange === 0) return [];
    
    const lines = [];
    const roundedMin = Math.floor(minElevation / 50) * 50;
    const roundedMax = Math.ceil(maxElevation / 50) * 50;
    
    for (let elevation = roundedMin; elevation <= roundedMax; elevation += 50) {
      if (elevation >= minElevation && elevation <= maxElevation) {
        // Calculate Y position (inverted because SVG coordinates start from top)
        const y = ((maxElevation - elevation) / elevationRange) * 100;
        lines.push({ elevation, y });
      }
    }
    
    return lines;
  };

  const gridLines = getGridLines();

  // Create SVG path for the elevation profile
  const createPath = () => {
    if (sortedWaypoints.length === 0) return '';

    const points = sortedWaypoints.map((wp, index) => {
      const x = (index / (sortedWaypoints.length - 1)) * 100;
      // Invert y because SVG coordinates start from top
      const y = elevationRange > 0 
        ? ((maxElevation - wp.elevation) / elevationRange) * 100
        : 50;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const createAreaPath = () => {
    if (sortedWaypoints.length === 0) return '';

    const points = sortedWaypoints.map((wp, index) => {
      const x = (index / (sortedWaypoints.length - 1)) * 100;
      const y = elevationRange > 0 
        ? ((maxElevation - wp.elevation) / elevationRange) * 100
        : 50;
      return `${x},${y}`;
    });

    // Create a closed path for the filled area
    const path = `M 0,100 L ${points.join(' L ')} L 100,100 Z`;
    return path;
  };

  return (
    <Box>
      <HStack justify="space-between" fontSize="xs" color="purple.700" mb={2}>
        <Text fontWeight="medium">📈 Elevation Profile</Text>
        <HStack spacing={1} fontSize="xs">
          <HStack  color="green.600">
            <TrendingUp size={12} />
            <Text>{Math.round(totalAscent)}m</Text>
          </HStack>
          <HStack  color="red.500">
            <TrendingDown size={12} />
            <Text>{Math.round(totalDescent)}m</Text>
          </HStack>
        </HStack>
      </HStack>

      {/* SVG Elevation Graph */}
      <Box 
        position="relative" 
        width="100%" 
        height={`${graphHeight}px`}
        bg="gray.50" 
        borderRadius="md"
        overflow="hidden"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          {/* Grid lines every 50m */}
          {gridLines.map((line) => (
            <line
              key={line.elevation}
              x1="0"
              y1={line.y}
              x2="100"
              y2={line.y}
              stroke="#A0AEC0"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="2,2"
            />
          ))}

          {/* Filled area under the line */}
          <path
            d={createAreaPath()}
            fill="url(#elevationGradient)"
            opacity="0.6"
          />
          
          {/* Elevation line */}
          <path
            d={createPath()}
            fill="none"
            stroke="#3182CE"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3182CE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3182CE" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Min/Max elevation labels */}
        <Box position="absolute" top="2px" left="4px" fontSize="9px" color="gray.600" bg="white" px={1} borderRadius="sm">
          {Math.round(maxElevation)}m
        </Box>
        <Box position="absolute" bottom="2px" left="4px" fontSize="9px" color="gray.600" bg="white" px={1} borderRadius="sm">
          {Math.round(minElevation)}m
        </Box>
      </Box>
    </Box>
  );
}