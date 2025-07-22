// src/components/Map/InicialMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useCallback } from 'react';          // ← add
import RoutingMachine from './RoutingMachine.jsx';
import 'leaflet/dist/leaflet.css';

const InicialMap = ({ onRouteInfo }) => {
  /* ----- callbacks ----- */
  const handleRouteResult = useCallback(        // ← memoised!
    (geojson, distM, ascendM, descendM) => {
      const distanceKm  = (distM / 1000).toFixed(2);
      const durationMin = Math.round(geojson.properties.totalTime / 60);

      console.log(
        `Distance: ${distanceKm} km  |  ↗︎ ${ascendM} m  ↘︎ ${descendM} m  |  Duration: ${durationMin} min`
      );
      // TODO: save to state or POST to backend

      onRouteInfo?.({ distanceKm, ascendM, descendM, durationMin });
    },
    [onRouteInfo]                               // ← stays stable
  );

  /* ----- ui ----- */
  return (
    <div style={{ height: '80%', width: '80vw' }}>
      <MapContainer
        center={[45.7774, 15.6521]} /* Ošterc peak */
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <RoutingMachine
          apiKey='15cd8335-e008-4c2b-a710-2b01581ac01e'
          onRouteFound={handleRouteResult}      // ← stable now
        />
      </MapContainer>
    </div>
  );
};

export default InicialMap;
