// src/components/Map/InicialMap.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from "react-leaflet";
import RoutingMachine from "./RoutingMachine.jsx";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const { BaseLayer, Overlay } = LayersControl;

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/* ──────────────────── geolocation hook with timeout ──────────────────── */
function useGeolocation() {
  const [pos, setPos] = useState(null);
  const [error, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErr("Geolocation not supported");
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Geolocation timeout - using default location");
        setLoading(false);
      }
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (p.coords.accuracy < 1000) {
          setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        }
        setLoading(false);
        clearTimeout(timeoutId);
      },
      (e) => {
        console.warn("Geolocation error:", e.message);
        setErr(e.message);
        setLoading(false);
        clearTimeout(timeoutId);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        if (p.coords.accuracy < 1000) {
          setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        }
      },
      (e) => setErr(e.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      clearTimeout(timeoutId);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { pos, error, loading };
}

/* Helper child that flies the map once we have coords */
function FlyToUser({ pos }) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (pos && !hasFlown.current) {
      map.flyTo([pos.lat, pos.lng], 14);
      hasFlown.current = true;
    }
  }, [pos, map]);

  return null;
}

/* ──────────────────── component ──────────────────── */
const InicialMap = ({ onRouteInfo, onRouteCreated, onWaypointsChange, shouldCreateRoute, shouldClearWaypoints }) => {
  const { pos, error, loading } = useGeolocation();

  const handleRouteResult = useCallback(
    (geojson, distM, ascendM, descendM) => {
      const distanceKm = (distM / 1000).toFixed(2);
      const durationMin = Math.round(geojson.properties.totalTime / 60);

      console.log(
        `Distance: ${distanceKm} km  |  ↗︎ ${ascendM} m  ↘︎ ${descendM} m  |  Duration: ${durationMin} min`
      );

      onRouteInfo?.({ distanceKm, ascendM, descendM, durationMin });
      onRouteCreated?.(geojson);
    },
    [onRouteInfo, onRouteCreated]
  );

  const fallbackCenter = [45.7774, 15.6521]; // Ošterc
  const mapCenter = pos ? [pos.lat, pos.lng] : fallbackCenter;
  const mapZoom = pos ? 14 : 15;

  console.log('InicialMap render:', {
    loading,
    hasPosition: !!pos,
    shouldCreateRoute,
    shouldClearWaypoints,
  });

  if (loading) {
    return (
      <div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(224, 224, 224, 0.3)",
            borderTop: "5px solid #3182CE",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <div style={{
            fontSize: "16px",
            color: "#333",
            fontWeight: "500"
          }}>
            Loading map...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {error && (
        <div style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "rgba(255, 200, 0, 0.9)",
          padding: "8px 16px",
          borderRadius: "4px",
          fontSize: "14px"
        }}>
          ⚠️ {error} - Using default location
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => console.log('Map is ready')}
      >
        <LayersControl position="topleft">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <Overlay name="Biome slojevi">
            <TileLayer
              url="http://130.61.255.30:8080/lulc_tiles/{z}/{x}/{y}.png"
              opacity={0.65}
              tms={false}
            />
          </Overlay>
        </LayersControl>

        {pos && (
          <Marker position={[pos.lat, pos.lng]}>
            <Popup>Vi ste ovdje</Popup>
          </Marker>
        )}

        {pos && <FlyToUser pos={pos} />}

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