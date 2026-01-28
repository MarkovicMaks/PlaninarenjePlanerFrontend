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
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f7f7f7',
        }}
      >
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

  // Check if we have elevation data
  const hasElevationData = trail.minElevation !== null && trail.maxElevation !== null;
  const startWaypoint = sortedWaypoints[0];
  const endWaypoint = sortedWaypoints[sortedWaypoints.length - 1];

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
        
        {/* Start marker (first waypoint) */}
        {positions.length > 0 && (
          <Marker position={positions[0]} icon={startIcon}>
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>🚀 Start Point</strong><br/>
                <div style={{ margin: '8px 0' }}>
                  <strong>{trail.name}</strong><br/>
                  <small>Waypoint 1</small>
                </div>
                
                {startWaypoint.elevation && (
                  <div style={{ marginTop: '8px', padding: '4px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                    <small>📊 <strong>Elevation:</strong> {Math.round(startWaypoint.elevation)}m</small>
                  </div>
                )}
                
                {hasElevationData && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    <div><strong>Trail Stats:</strong></div>
                    <div>📍 Length: {trail.lengthKm} km</div>
                    <div>⛰️ Range: {Math.round(trail.minElevation)}m - {Math.round(trail.maxElevation)}m</div>
                    <div>📈 Ascent: {Math.round(trail.totalAscent)}m</div>
                    <div>📉 Descent: {Math.round(trail.totalDescent)}m</div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End marker (last waypoint, only if different from start) */}
        {positions.length > 1 && (
          <Marker position={positions[positions.length - 1]} icon={endIcon}>
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <strong>🏁 End Point</strong><br/>
                <div style={{ margin: '8px 0' }}>
                  <strong>{trail.name}</strong><br/>
                  <small>Waypoint {endWaypoint.order}</small>
                </div>
                
                {endWaypoint.elevation && (
                  <div style={{ marginTop: '8px', padding: '4px', backgroundColor: '#fff0f0', borderRadius: '4px' }}>
                    <small>📊 <strong>Elevation:</strong> {Math.round(endWaypoint.elevation)}m</small>
                  </div>
                )}
                
                {startWaypoint.elevation && endWaypoint.elevation && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    <strong>Elevation Change:</strong><br/>
                    {endWaypoint.elevation > startWaypoint.elevation ? 
                      <span style={{color: 'green'}}>↗ +{Math.round(endWaypoint.elevation - startWaypoint.elevation)}m</span> :
                      <span style={{color: 'red'}}>↘ {Math.round(endWaypoint.elevation - startWaypoint.elevation)}m</span>
                    }
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}