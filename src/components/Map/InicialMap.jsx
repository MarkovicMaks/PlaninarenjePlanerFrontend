// src/components/Map/InicialMap.jsx
import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import RoutingMachine from "./RoutingMachine.jsx";
import "leaflet/dist/leaflet.css";

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

const InicialMap = ({ onRouteInfo }) => {
  const { pos, error } = useGeolocation();

  /* ----- route callback ----- */
  const handleRouteResult = useCallback(
    (geojson, distM, ascendM, descendM) => {
      const distanceKm = (distM / 1000).toFixed(2);
      const durationMin = Math.round(geojson.properties.totalTime / 60);

      console.log(
        `Distance: ${distanceKm} km  |  ↗︎ ${ascendM} m  ↘︎ ${descendM} m  |  Duration: ${durationMin} min`
      );

      onRouteInfo?.({ distanceKm, ascendM, descendM, durationMin });
    },
    [onRouteInfo]
  );

  /* ----- map ui ----- */
  const fallbackCenter = [45.7774, 15.6521]; // Ošterc
  const mapCenter = pos ? [pos.lat, pos.lng] : fallbackCenter;
  const mapZoom = pos ? 14 : 15;

  return (
    <div style={{ height: "80%", width: "80vw" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pos && (
          <Marker position={[pos.lat, pos.lng]}>
            <Popup>Vi ste ovdje</Popup>
          </Marker>
        )}
        {/* fly once permission granted */}
        <FlyToUser pos={pos} />

        <RoutingMachine
          apiKey="15cd8335-e008-4c2b-a710-2b01581ac01e"
          onRouteFound={handleRouteResult}
        />
      </MapContainer>
    </div>
  );
};

export default InicialMap;
