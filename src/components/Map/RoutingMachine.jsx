// RoutingMachine.jsx - FIXED VERSION
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

  // Function to fetch elevation data with ALL waypoints
  const fetchElevationData = React.useCallback(async (waypoints) => {
    try {
      // Build URL with ALL waypoints
      const points = waypoints.map(wp => `point=${wp.lat},${wp.lng}`).join('&');
      const url = `https://graphhopper.com/api/1/route?${points}&vehicle=foot&elevation=true&points_encoded=false&key=${apiKey}`;
      
      console.log('Fetching elevation data for', waypoints.length, 'waypoints');
      
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
      autoRoute: true,
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.7, weight: 4 }]
      }
    }).addTo(map);

    routingControlRef.current = control;

    // Handle map clicks to add waypoints
    const handleMapClick = (e) => {
      const newWaypoints = [...waypointsRef.current, e.latlng];
      waypointsRef.current = newWaypoints;
      
      control.setWaypoints(newWaypoints);
      onWaypointsChange?.(newWaypoints);
    };

    map.on('click', handleMapClick);

    // Listen for route results
    control.on('routesfound', async function(e) {
      const route = e.routes[0];
      if (!route) return;

      const { totalDistance, totalTime } = route.summary;
      
      // Fetch elevation data with ALL waypoints
      let elevationData = null;
      if (waypointsRef.current.length >= 2) {
        elevationData = await fetchElevationData(waypointsRef.current);
      }
      
      // Use elevation coordinates if available, otherwise fall back to route coordinates
      let finalCoordinates = [];
      if (elevationData && elevationData.coordinates.length > 0) {
        finalCoordinates = elevationData.coordinates;
      } else if (route.coordinates && route.coordinates.length > 0) {
        finalCoordinates = route.coordinates.map(c => [c.lng, c.lat]);
      } else {
        // Last resort fallback
        finalCoordinates = waypointsRef.current.map(wp => [wp.lng, wp.lat]);
      }
      
      // Create GeoJSON
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: finalCoordinates
        },
        properties: { 
          totalDistance, 
          totalTime,
          elevationData: elevationData?.coordinates,
          waypointCount: waypointsRef.current.length
        }
      };

      // Get elevation changes
      let ascendM = 0;
      let descendM = 0;
      
      if (elevationData) {
        ascendM = elevationData.ascend;
        descendM = elevationData.descend;
      } else if (route.instructions) {
        // Fallback calculation from instructions
        route.instructions.forEach(instruction => {
          if (instruction.ascend) ascendM += instruction.ascend;
          if (instruction.descend) descendM += instruction.descend;
        });
      }

      console.log('Route created:', {
        waypoints: waypointsRef.current.length,
        coordinates: finalCoordinates.length,
        distance: totalDistance,
        ascend: ascendM,
        descend: descendM,
        hasElevationData: !!elevationData
      });

      setTimeout(() => {
        onRouteFound?.(geojson, totalDistance, ascendM, descendM);
      }, 0);
    });

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, onRouteFound, onWaypointsChange, fetchElevationData]);

  // Trigger routing
  React.useEffect(() => {
    if (shouldCreateRoute && routingControlRef.current && waypointsRef.current.length >= 2) {
      console.log('Creating route with waypoints:', waypointsRef.current);
      routingControlRef.current.route();
    }
  }, [shouldCreateRoute]);

  // Clear waypoints
  React.useEffect(() => {
    if (shouldClearWaypoints && routingControlRef.current) {
      console.log('Clearing waypoints');
      
      map.removeControl(routingControlRef.current);
      
      const control = L.Routing.control({
        waypoints: [],
        router: L.Routing.graphHopper(apiKey, {
          urlParameters: { vehicle: 'foot' }
        }),
        autoRoute: true,
        routeWhileDragging: false,
        addWaypoints: false,
        show: false,
        lineOptions: {
          styles: [{ color: 'blue', opacity: 0.7, weight: 4 }]
        }
      }).addTo(map);
      
      routingControlRef.current = control;
      waypointsRef.current = [];
      onWaypointsChange?.([]);
    }
  }, [shouldClearWaypoints, onWaypointsChange, map, apiKey]);

  return null;
}

export default RoutingMachine;