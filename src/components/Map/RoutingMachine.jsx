import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';                      // adds L.Routing
import 'lrm-graphhopper';                              // adds L.Routing.graphHopper

import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


function RoutingMachine({ apiKey, onRouteFound }) {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [],  // start with no waypoints
      router: L.Routing.graphHopper(apiKey, {  // use GraphHopper routing backend
        urlParameters: { vehicle: 'foot' }     // specify foot (hiking) profile:contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
      }),
      autoRoute: true,
      routeWhileDragging: false,
      addWaypoints: false,       // disable dragging to add new waypoints by line
      show: false                // do not show the itinerary panel
    }).addTo(map);

    // On each click, add a new waypoint and recompute route
    map.on('click', (e) => {
      const waypoints = routingControl.getWaypoints().map(wp => wp.latLng).filter(Boolean);
      waypoints.push(e.latlng);
      routingControl.setWaypoints(waypoints);
    });

    // Listen for route results to retrieve GeoJSON and distance
    routingControl.on('routesfound', function(e) {
      const route = e.routes[0];
      const { totalDistance, totalTime } = route.summary;  // in meters and seconds:contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates.map(coord => [coord.lng, coord.lat])  // convert to [lng, lat]
        },
        properties: { totalDistance, totalTime }
      };
      onRouteFound?.(geojson, totalDistance);
    });

    return () => map.removeControl(routingControl);
  }, [map, apiKey, onRouteFound]);

  return null;
}

export default RoutingMachine;