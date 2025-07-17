import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const InicialMap = () => {
  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polyline") {
      const latlngs = layer.getLatLngs();
      console.log("New trail:", latlngs);
    }
  };

  return (
    <div style={{ height: "90%", width: "80vw" }}>
      <MapContainer
        center={[45.7774, 15.6521]} // Ošterccc
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              polyline: true,
              polygon: false,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
            edit={{ remove: true }}
            onCreated={handleCreated}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default InicialMap;
