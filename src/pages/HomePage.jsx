// src/pages/HomePage.jsx
import InicialMap from "../components/Map/InicialMap";
import Navbar from "../components/Navbar";
import MapControls from "../components/Map/MapControls";
import { useState, useCallback, useEffect } from "react";
import { Box } from "@chakra-ui/react";

export default function HomePage() {
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [shouldClearWaypoints, setShouldClearWaypoints] = useState(false);

  const handleRouteCreated = useCallback((route) => {
    console.log("Route created:", route);
    setCurrentRoute(route);
  }, []);

  const handleWaypointsChange = useCallback(
    (newWaypoints) => {
      setWaypoints(newWaypoints);
      // Clear previous route when waypoints change
      if (currentRoute) {
        setCurrentRoute(null);
        setRouteInfo(null);
      }
    },
    [currentRoute],
  );

  const handleClearWaypoints = useCallback(() => {
    setShouldClearWaypoints(true);

    // Reset all state
    setWaypoints([]);
    setCurrentRoute(null);
    setRouteInfo(null);
  }, []);

  const handleTrailSaved = useCallback(() => {
    // Clear everything after saving
    handleClearWaypoints();
  }, [handleClearWaypoints]);

  // Reset flag after it has been processed in InicialMap/RoutingMachine
  useEffect(() => {
    if (shouldClearWaypoints) {
      const timer = setTimeout(() => setShouldClearWaypoints(false), 100);
      return () => clearTimeout(timer);
    }
  }, [shouldClearWaypoints]);

  return (
    <div className="HomeLayout">
      {/* Top navbar */}
      <Navbar />

      {/* Map fills the rest of the page */}
      <Box position="relative" flex="1" width="100%" bg="gray.100">
        <InicialMap
          onRouteInfo={setRouteInfo}
          onRouteCreated={handleRouteCreated}
          onWaypointsChange={handleWaypointsChange}
          // we no longer use shouldCreateRoute, only clear
          shouldClearWaypoints={shouldClearWaypoints}
        />

        <MapControls
          waypointsCount={waypoints.length}
          onClearWaypoints={handleClearWaypoints}
          routeInfo={routeInfo}
          currentRoute={currentRoute}
          onTrailSaved={handleTrailSaved}
        />
      </Box>
    </div>
  );
}
