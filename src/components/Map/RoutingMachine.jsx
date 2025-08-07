import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'lrm-graphhopper';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

function RoutingMachine({ apiKey, onRouteFound, shouldCreateRoute = false, onWaypointsChange, shouldClearWaypoints = false }) {
  const map = useMap();
  const routingControlRef = React.useRef(null);
  const waypointsRef = React.useRef([]);

  // Function to fetch 3D elevation data from GraphHopper
  const fetchElevationData = React.useCallback(async (startPoint, endPoint) => {
    try {
      // SAMO 2 točke za elevation API - start i end
      const url = `https://graphhopper.com/api/1/route?point=${startPoint.lat},${startPoint.lng}&point=${endPoint.lat},${endPoint.lng}&vehicle=foot&elevation=true&points_encoded=false&key=${apiKey}`;
      
      console.log('Fetching elevation data:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.warn('Could not fetch elevation data:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.paths && data.paths.length > 0) {
        const path = data.paths[0];
        console.log('Elevation data received:', {
          coordinates: path.points.coordinates.length,
          ascend: path.ascend,
          descend: path.descend
        });
        
        return {
          coordinates: path.points.coordinates, // [lng, lat, elevation]
          ascend: path.ascend || 0,
          descend: path.descend || 0
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Error fetching elevation data:', error);
      return null;
    }
  }, [apiKey]);

  React.useEffect(() => {
    if (!map) return;

    // Create routing control with GraphHopper
    const control = L.Routing.control({
      waypoints: [],
      router: L.Routing.graphHopper(apiKey, {
        urlParameters: { vehicle: 'foot' }
      }),
      autoRoute: false, // Disable auto routing
      routeWhileDragging: false,
      addWaypoints: false,
      show: false
    }).addTo(map);

    routingControlRef.current = control;

    // Handle map clicks to add waypoints
    const handleMapClick = (e) => {
      const newWaypoints = [...waypointsRef.current, e.latlng];
      waypointsRef.current = newWaypoints;
      
      // Update routing control waypoints but don't route yet
      control.setWaypoints(newWaypoints);
      
      // Notify parent immediately
      onWaypointsChange?.(newWaypoints);
    };

    map.on('click', handleMapClick);

    // Listen for route results when routing is triggered
    control.on('routesfound', async function(e) {
      const route = e.routes[0];
      if (!route) return;

      const { totalDistance, totalTime } = route.summary;
      
      // Get basic route coordinates from leaflet-routing-machine
      const basicCoordinates = route.coordinates.map(coord => [coord.lng, coord.lat]);
      
      // Try to fetch elevation data SAMO za start i end point
      let elevationData = null;
      if (waypointsRef.current.length >= 2) {
        const startPoint = waypointsRef.current[0];
        const endPoint = waypointsRef.current[waypointsRef.current.length - 1];
        elevationData = await fetchElevationData(startPoint, endPoint);
      }
      
      // Create GeoJSON with or without elevation
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: elevationData ? elevationData.coordinates : basicCoordinates
        },
        properties: { 
          totalDistance, 
          totalTime,
          elevationData: elevationData?.coordinates // Store 3D data if available
        }
      };

      // Calculate elevation changes
      let ascendM = 0;
      let descendM = 0;
      
      if (elevationData) {
        // Use GraphHopper's calculated ascent/descent
        ascendM = elevationData.ascend;
        descendM = elevationData.descend;
      } else {
        // Fallback: try to calculate from route instructions
        if (route.instructions) {
          route.instructions.forEach(instruction => {
            if (instruction.ascend) ascendM += instruction.ascend;
            if (instruction.descend) descendM += instruction.descend;
          });
        }
      }

      console.log('Route created with elevation:', {
        distance: totalDistance,
        ascend: ascendM,
        descend: descendM,
        hasElevationData: !!elevationData
      });

      // Defer callback to avoid setState during render
      setTimeout(() => {
        onRouteFound?.(geojson, totalDistance, ascendM, descendM);
      }, 0);
    });

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, onRouteFound, onWaypointsChange, fetchElevationData]);

  // Trigger routing when shouldCreateRoute changes to true
  React.useEffect(() => {
    if (shouldCreateRoute && routingControlRef.current && waypointsRef.current.length >= 2) {
      console.log('Creating route with waypoints:', waypointsRef.current);
      routingControlRef.current.route(); // Manually trigger routing
    }
  }, [shouldCreateRoute]);

  // Clear waypoints when shouldClearWaypoints changes to true
  React.useEffect(() => {
    if (shouldClearWaypoints && routingControlRef.current) {
      console.log('Clearing waypoints');
      
      // Clear waypoints from routing control
      routingControlRef.current.setWaypoints([]);
      
      // Clear local state
      waypointsRef.current = [];
      
      // Notify parent immediately
      onWaypointsChange?.([]);
    }
  }, [shouldClearWaypoints, onWaypointsChange]);

  return null;
}

export default RoutingMachine;