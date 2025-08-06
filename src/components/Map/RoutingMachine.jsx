import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'lrm-graphhopper';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

function RoutingMachine({ apiKey, onRouteFound, shouldCreateRoute = false, onWaypointsChange, shouldClearWaypoints = false }) {
  const map = useMap();
  const [routingControl, setRoutingControl] = React.useState(null);
  const [waypoints, setWaypoints] = React.useState([]);

  React.useEffect(() => {
    if (!map) return;

    // Create routing control but don't auto-route
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

    setRoutingControl(control);

    // Handle map clicks to add waypoints
    const handleMapClick = (e) => {
      setWaypoints(prev => {
        const newWaypoints = [...prev, e.latlng];
        
        // Update routing control waypoints but don't route yet
        control.setWaypoints(newWaypoints);
        
        // Notify parent of waypoint changes
        onWaypointsChange?.(newWaypoints);
        
        return newWaypoints;
      });
    };

    map.on('click', handleMapClick);

    // Listen for route results when routing is triggered
    control.on('routesfound', function(e) {
      const route = e.routes[0];
      if (!route) return;

      const { totalDistance, totalTime } = route.summary;
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates.map(coord => [coord.lng, coord.lat])
        },
        properties: { totalDistance, totalTime }
      };

      // Calculate elevation if available
      let ascendM = 0;
      let descendM = 0;
      
      if (route.instructions) {
        route.instructions.forEach(instruction => {
          if (instruction.ascend) ascendM += instruction.ascend;
          if (instruction.descend) descendM += instruction.descend;
        });
      }

      onRouteFound?.(geojson, totalDistance, ascendM, descendM);
    });

    return () => {
      map.off('click', handleMapClick);
      map.removeControl(control);
    };
  }, [map, apiKey]);

  // Trigger routing when shouldCreateRoute changes to true
  React.useEffect(() => {
    if (shouldCreateRoute && routingControl && waypoints.length >= 2) {
      console.log('Creating route with waypoints:', waypoints);
      routingControl.route(); // Manually trigger routing
    }
  }, [shouldCreateRoute, routingControl, waypoints]);

  // Clear waypoints when shouldClearWaypoints changes to true
  React.useEffect(() => {
    if (shouldClearWaypoints && routingControl) {
      console.log('Clearing waypoints');
      
      // Clear waypoints from routing control
      routingControl.setWaypoints([]);
      
      // Clear local state
      setWaypoints([]);
      
      // Notify parent
      onWaypointsChange?.([]);
    }
  }, [shouldClearWaypoints, routingControl, onWaypointsChange]);

  return null;
}

export default RoutingMachine;