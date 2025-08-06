// src/pages/Home.jsx
import Filterbar from "../components/Filters/Filterbar";
import InicialMap from "../components/Map/InicialMap";
import Navbar from "../components/Navbar";
import MapInfo from "../components/Map/MapInfo";
import  { useState } from "react";

export default function ListPage() {
  const [routeInfo, setRouteInfo] = useState(null);
  return (
    <div className="HomeLayout">
      <Filterbar />
      <div>
        <Navbar />
        <InicialMap onRouteInfo={setRouteInfo} />
        <MapInfo routeInfo={routeInfo} />
      </div>
    </div>
  );
}