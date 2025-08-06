// src/pages/Home.jsx
import Filterbar from "../components/Filters/Filterbar";
import InicialMap from "../components/Map/InicialMap";
import Navbar from "../components/Navbar";
import MapInfo from "../components/Map/MapInfo";
import { useState } from "react";

export default function HomePage() {
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);

  const handleRouteCreated = (route) => {
    console.log('Route created:', route);
    setCurrentRoute(route);
  };

  return (
    <div className="HomeLayout">
      <Filterbar />
      <div>
        <Navbar />
        <InicialMap 
          onRouteInfo={setRouteInfo} 
          onRouteCreated={handleRouteCreated}
        />
        <MapInfo 
          routeInfo={routeInfo} 
          currentRoute={currentRoute}
        />
      </div>
    </div>
  );
}