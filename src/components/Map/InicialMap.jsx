import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './RoutingMachine.jsx';
import 'leaflet/dist/leaflet.css';

const InicialMap = () => {
  /* ----- callbacks ----- */
  const handleRouteResult = (geojson, distanceKm) => {
    console.log('Auto-route ready:', geojson, distanceKm);
    // TODO: save to state or POST to backend
  };

  /* ----- ui ----- */
  return (
    <div style={{ height: '90%', width: '80vw' }}>
      <MapContainer
        center={[45.7774, 15.6521]} /* Ošterc peak */
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* -- AUTO-ROUTE only -- */}
        <RoutingMachine apiKey={'15cd8335-e008-4c2b-a710-2b01581ac01e'} onRouteFound={handleRouteResult} />
      </MapContainer>
    </div>
  );
};

export default InicialMap;
