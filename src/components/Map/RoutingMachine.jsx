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
  const routeLineRef = React.useRef(null);

  React.useEffect(() => {
    if (!map) return;

    // Create routing control with GraphHopper
    const control = L.Routing.control({
      waypoints: [],
      router: L.Routing.graphHopper(apiKey, {
        urlParameters: { vehicle: 'foot' }
      }),
      autoRoute: true,  // Changed to true - route automatically after each waypoint
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
      
      // Update routing control waypoints but don't route yet
      control.setWaypoints(newWaypoints);
      
      // Notify parent immediately
      onWaypointsChange?.(newWaypoints);
    };

    map.on('click', handleMapClick);

    // Listen for route results
    control.on('routesfound', function(e) {
      const route = e.routes[0];
      if (!route) return;

      console.log('=== FULL ROUTE OBJECT ===');
      console.log('Route:', route);
      console.log('Route.coordinates:', route.coordinates);
      console.log('Route.instructions:', route.instructions);

      const { totalDistance, totalTime } = route.summary;
      
      // Extract ALL coordinates from the route
      // The route line should already be drawn on the map by leaflet-routing-machine
      // We need to get those coordinates
      let allCoordinates = [];
      
      // Try multiple sources for coordinates
      if (route.coordinates && route.coordinates.length > 0) {
        // Method 1: Direct coordinates (this is empty in your case)
        allCoordinates = route.coordinates.map(c => [c.lng, c.lat]);
        console.log('Got coordinates from route.coordinates:', allCoordinates.length);
      } else if (route.instructions && route.instructions.length > 0) {
        // Method 2: Extract from instructions
        // Each instruction has an index pointing to coordinates
        // We need to access the actual coordinate data
        console.log('Extracting from instructions...');
        
        // The problem: instructions only have indices, not the actual coordinates
        // We need to get them from the route line that's drawn on the map
        
        // Check if there's a waypoints array with route points
        if (route.waypoints && route.waypoints.length > 0) {
          allCoordinates = route.waypoints.map(wp => [wp.latLng.lng, wp.latLng.lat]);
          console.log('Got coordinates from route.waypoints:', allCoordinates.length);
        }
      }
      
      // Fallback: use input waypoints (this is what's causing your bug!)
      if (allCoordinates.length === 0) {
        console.warn('Could not extract route coordinates! Falling back to input waypoints');
        allCoordinates = waypointsRef.current.map(wp => [wp.lng, wp.lat]);
      }

      console.log('Final coordinates count:', allCoordinates.length);

      // Calculate elevation
      let ascendM = 0;
      let descendM = 0;
      
      if (route.instructions) {
        route.instructions.forEach(instruction => {
          if (instruction.ascend) ascendM += instruction.ascend;
          if (instruction.descend) descendM += instruction.descend;
        });
      }

      // Create GeoJSON
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: allCoordinates
        },
        properties: { 
          totalDistance, 
          totalTime,
          waypointCount: waypointsRef.current.length
        }
      };

      console.log('Created GeoJSON with', allCoordinates.length, 'coordinates');

      setTimeout(() => {
        onRouteFound?.(geojson, totalDistance, ascendM, descendM);
      }, 0);
    });

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, onRouteFound, onWaypointsChange]);

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
      
      // Clear waypoints from routing control
      routingControlRef.current.setWaypoints([]);
      
      // Clear the route from the map by removing and re-adding the control
      // This is necessary because leaflet-routing-machine caches the route
      map.removeControl(routingControlRef.current);
      
      // Create a fresh routing control
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
      
      // Clear local state
      waypointsRef.current = [];
      
      // Notify parent
      onWaypointsChange?.([]);
    }
  }, [shouldClearWaypoints, onWaypointsChange, map, apiKey]);

  return null;
}

export default RoutingMachine;