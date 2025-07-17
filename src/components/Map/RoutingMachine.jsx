// src/components/Map/RoutingMachine.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "lrm-graphhopper";

export default function RoutingMachine({ onRouteReady }) {
  const map = useMap();

  useEffect(() => {
    // 1. Create the control with GraphHopper walking profile
    const control = L.Routing.control({
      waypoints: [],
      position: "topright",
      addWaypoints: true,
      draggableWaypoints: true,
      routeWhileDragging: true,
      show: true,
      collapsible: false,
      router: L.Routing.graphHopper("YOUR_GRAPHOPPER_API_KEY", {
        profile: "foot", // or 'hike', 'bike', etc.
      }),
      lineOptions: { styles: [{ color: "#1E90FF", weight: 4 }] },
    }).addTo(map);

    // 🔄 LOG when a routing request actually starts
    control.on("routingstart", () => {
      console.log("Routing calculation started…");
    });

    // ✅ LOG + callback when a route is found
    control.on("routesfound", (e) => {
      console.log("Route found (GraphHopper)", e);
      const route = e.routes[0];
      const coords = route.coordinates.map((c) => [c.lng, c.lat]);
      const geojson = { type: "LineString", coordinates: coords };
      const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
      onRouteReady(geojson, distanceKm);
    });

    // ❌ LOG if GraphHopper returns an error
    control.on("routingerror", (e) => {
      console.error("Routing error:", e.error || e);
    });

    /* -------- manual click-to-add waypoints (your original code) ------- */
    let clickCount = 0;
    const addWp = (e) => {
      console.log(
        "Adding waypoint, GraphHopper service URL =",
        control.options.router.options.serviceUrl
      );
      control.spliceWaypoints(clickCount++, 0, e.latlng);
    };
    map.on("click", addWp);

    return () => {
      map.off("click", addWp);
      map.removeControl(control);
    };
  }, [map, onRouteReady]);

  return null;
}
