// src/components/Trails/TrailMap.jsx
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for start/end waypoints
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit bounds to trail
function FitBounds({ waypoints }) {
  const map = useMap();
  
  useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(wp => [wp.latitude, wp.longitude]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [waypoints, map]);
  
  return null;
}

export default function TrailMap({ trail }) {
  if (!trail || !trail.waypoints || trail.waypoints.length === 0) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f7f7' }}>
        <p>Select a trail to view on map</p>
      </div>
    );
  }

  // Convert waypoints to polyline positions (sorted by order)
  const sortedWaypoints = [...trail.waypoints].sort((a, b) => a.order - b.order);
  const positions = sortedWaypoints.map(wp => [wp.latitude, wp.longitude]);
  
  // Calculate center of the trail
  const centerLat = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
  const centerLng = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show entire trail */}
        <FitBounds waypoints={sortedWaypoints} />
        
        {/* Draw the trail route */}
        <Polyline 
          positions={positions}
          color="blue"
          weight={4}
          opacity={0.7}
        />
        
        {/* Start marker */}
        {positions.length > 0 && (
          <Marker position={positions[0]} icon={startIcon}>
            <Popup>
              <div>
                <strong>Start</strong><br/>
                {trail.name}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End marker (if different from start) */}
        {positions.length > 1 && (
          <Marker position={positions[positions.length - 1]} icon={endIcon}>
            <Popup>
              <div>
                <strong>End</strong><br/>
                {trail.name}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Intermediate waypoints */}
        {sortedWaypoints.slice(1, -1).map((waypoint, index) => (
          <Marker 
            key={`waypoint-${waypoint.order}`} 
            position={[waypoint.latitude, waypoint.longitude]}
          >
            <Popup>
              <div>
                <strong>Waypoint {waypoint.order}</strong><br/>
                Lat: {waypoint.latitude.toFixed(6)}<br/>
                Lng: {waypoint.longitude.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}