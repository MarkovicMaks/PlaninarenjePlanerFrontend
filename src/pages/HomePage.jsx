// src/pages/HomePage.jsx
import Filterbar from "../components/Filters/Filterbar";
import InicialMap from "../components/Map/InicialMap";
import Navbar from "../components/Navbar";
import MapInfo from "../components/Map/MapInfo";
import MapControls from "../components/Map/MapControls";
import { useState, useCallback, useEffect } from "react";
import { Box } from "@chakra-ui/react";

export default function HomePage() {
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [shouldCreateRoute, setShouldCreateRoute] = useState(false);
  const [shouldClearWaypoints, setShouldClearWaypoints] = useState(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  const handleRouteCreated = useCallback((route) => {
    console.log('Route created:', route);
    setCurrentRoute(route);
    setIsCreatingRoute(false);
  }, []);

  const handleWaypointsChange = useCallback((newWaypoints) => {
    setWaypoints(newWaypoints);
    // Clear previous route when waypoints change
    if (currentRoute) {
      setCurrentRoute(null);
      setRouteInfo(null);
    }
  }, [currentRoute]);

  const handleCreateRoute = useCallback(() => {
    if (waypoints.length >= 2) {
      setIsCreatingRoute(true);
      setShouldCreateRoute(true);
    }
  }, [waypoints.length]);

  const handleClearWaypoints = useCallback(() => {
    setShouldClearWaypoints(true);
    
    // Reset all state
    setWaypoints([]);
    setCurrentRoute(null);
    setRouteInfo(null);
    setIsCreatingRoute(false);
  }, []);

  const handleTrailSaved = useCallback(() => {
    // Clear everything after saving
    handleClearWaypoints();
  }, [handleClearWaypoints]);

  // Reset flags after they've been processed
  useEffect(() => {
    if (shouldCreateRoute) {
      const timer = setTimeout(() => setShouldCreateRoute(false), 100);
      return () => clearTimeout(timer);
    }
  }, [shouldCreateRoute]);

  useEffect(() => {
    if (shouldClearWaypoints) {
      const timer = setTimeout(() => setShouldClearWaypoints(false), 100);
      return () => clearTimeout(timer);
    }
  }, [shouldClearWaypoints]);

  return (
    <div className="HomeLayout">
      <Filterbar />
      <div>
        <Navbar />
        <Box position="relative" height="500px" width="100%" bg="gray.100">
          <InicialMap 
            onRouteInfo={setRouteInfo} 
            onRouteCreated={handleRouteCreated}
            onWaypointsChange={handleWaypointsChange}
            shouldCreateRoute={shouldCreateRoute}
            shouldClearWaypoints={shouldClearWaypoints}
          />
          <MapControls
            waypointsCount={waypoints.length}
            onCreateRoute={handleCreateRoute}
            onClearWaypoints={handleClearWaypoints}
            isCreatingRoute={isCreatingRoute}
          />
        </Box>
        <MapInfo 
          routeInfo={routeInfo} 
          currentRoute={currentRoute}
          onClearAfterSave={handleTrailSaved}
        />
      </div>
    </div>
  );
}