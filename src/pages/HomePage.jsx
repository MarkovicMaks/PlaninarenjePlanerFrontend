// src/pages/Home.jsx
import Filterbar from "../components/Filters/Filterbar";
import InicialMap from "../components/Map/InicialMap";
import Navbar from "../components/Navbar";
import MapInfo from "../components/Map/MapInfo";
import MapControls from "../components/Map/MapControls";
import { useState } from "react";
import { Box } from "@chakra-ui/react";

export default function HomePage() {
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [shouldCreateRoute, setShouldCreateRoute] = useState(false);
  const [shouldClearWaypoints, setShouldClearWaypoints] = useState(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  const handleRouteCreated = (route) => {
    console.log('Route created:', route);
    setCurrentRoute(route);
    setIsCreatingRoute(false);
    setShouldCreateRoute(false); // Reset trigger
  };

  const handleWaypointsChange = (newWaypoints) => {
    setWaypoints(newWaypoints);
    // Clear previous route when waypoints change
    if (currentRoute) {
      setCurrentRoute(null);
      setRouteInfo(null);
    }
  };

  const handleCreateRoute = () => {
    if (waypoints.length >= 2) {
      setIsCreatingRoute(true);
      setShouldCreateRoute(true); // Trigger route creation
    }
  };

  const handleClearWaypoints = () => {
    setShouldClearWaypoints(true);
    
    // Reset all state
    setWaypoints([]);
    setCurrentRoute(null);
    setRouteInfo(null);
    
    // Reset clear trigger after a short delay
    setTimeout(() => {
      setShouldClearWaypoints(false);
    }, 100);
  };

  const handleTrailSaved = () => {
    // Clear everything after saving
    handleClearWaypoints();
  };

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