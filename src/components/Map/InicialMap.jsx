// src/components/Map/InicialMap.jsx
import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import RoutingMachine from "./RoutingMachine.jsx";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/* ──────────────────── geolocation hook ──────────────────── */
function useGeolocation() {
  const [pos, setPos] = useState(null); // { lat, lng } | null
  const [error, setErr] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErr("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        // ignore very coarse fixes
        if (p.coords.accuracy < 1000) {
          setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        }
      },
      (e) => setErr(e.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { pos, error };
}

/* Helper child that flies the map once we have coords */
function FlyToUser({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo([pos.lat, pos.lng], 14); // animate
  }, [pos, map]);
  return null;
}

/* ──────────────────── component ──────────────────── */
const InicialMap = ({ onRouteInfo, onRouteCreated, onWaypointsChange, shouldCreateRoute, shouldClearWaypoints }) => {
  const { pos, error } = useGeolocation();

  /* ----- route callback ----- */
  const handleRouteResult = useCallback(
    (geojson, distM, ascendM, descendM) => {
      const distanceKm = (distM / 1000).toFixed(2);
      const durationMin = Math.round(geojson.properties.totalTime / 60);

      console.log(
        `Distance: ${distanceKm} km  |  ↗︎ ${ascendM} m  ↘︎ ${descendM} m  |  Duration: ${durationMin} min`
      );

      // Pass route info to parent
      onRouteInfo?.({ distanceKm, ascendM, descendM, durationMin });
      
      // Pass full route data for saving
      onRouteCreated?.(geojson);
    },
    [onRouteInfo, onRouteCreated]
  );

  /* ----- map ui ----- */
  const fallbackCenter = [45.7774, 15.6521]; // Ošterc
  const mapCenter = pos ? [pos.lat, pos.lng] : fallbackCenter;
  const mapZoom = pos ? 14 : 15;

  console.log('InicialMap render with props:', { 
    shouldCreateRoute, 
    shouldClearWaypoints,
    onWaypointsChange: !!onWaypointsChange 
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        // VAŽNO: Dodaj event handler props da nema konflikata
        whenReady={() => console.log('Map is ready')}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {pos && (
          <Marker position={[pos.lat, pos.lng]}>
            <Popup>Vi ste ovdje</Popup>
          </Marker>
        )}
        
        <FlyToUser pos={pos} />

        {/* Routing machine - main component for waypoints and routing */}
        <RoutingMachine
          apiKey="15cd8335-e008-4c2b-a710-2b01581ac01e"
          onRouteFound={handleRouteResult}
          onWaypointsChange={onWaypointsChange}
          shouldCreateRoute={shouldCreateRoute}
          shouldClearWaypoints={shouldClearWaypoints}
        />
      </MapContainer>
    </div>
  );
};

export default InicialMap;