import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Correction des icônes Leaflet sous React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

// Composant gérant le clic sur la carte
function ClickMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Composant principal
export default function MapClicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    if (onSelect) onSelect(latlng);
  };

  return (
    <div style={{ position: "relative", marginTop: "15px" }}>
      {/*  Message d'aide */}
      <p
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          zIndex: 1000,
        }}
      >
         Cliquez sur la carte pour placer un marqueur
      </p>

      {/*  Carte basemap.xyz */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <TileLayer
          url="https://tiles.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution="© basemap.xyz | © OpenStreetMap contributors"
        />
        <ClickMarker onMapClick={handleMapClick} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
