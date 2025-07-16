import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
    dragend(e) {
      // Not needed, marker is draggable
    }
  });
  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{ dragend: (e) => {
        const { lat, lng } = e.target.getLatLng();
        setPosition([lat, lng]);
      }}}
    />
  );
}

const MapPicker = ({ position, setPosition, institutionCoords }) => {
  // Focus map on start point (house/current location), else institution, else default
  const [mapCenter, setMapCenter] = React.useState([-1.286389, 36.817223]);
  React.useEffect(() => {
    if (position) {
      setMapCenter(position);
    } else if (institutionCoords) {
      setMapCenter(institutionCoords);
    }
  }, [position, institutionCoords]);

  // Fetch and display true road route using OSRM
  const [routeCoords, setRouteCoords] = React.useState([]);
  React.useEffect(() => {
    if (position && institutionCoords) {
      const url = `https://router.project-osrm.org/route/v1/driving/${position[1]},${position[0]};${institutionCoords[1]},${institutionCoords[0]}?overview=full&geometries=geojson`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            setRouteCoords(data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          } else {
            setRouteCoords([]);
          }
        })
        .catch(() => setRouteCoords([]));
    } else {
      setRouteCoords([]);
    }
  }, [position, institutionCoords]);

  return (
    <div className="w-full h-64 rounded overflow-hidden border mt-2">
      <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {institutionCoords && (
          <Marker position={institutionCoords}>
            <Popup>Institution</Popup>
          </Marker>
        )}
        <LocationMarker position={position} setPosition={setPosition} />
        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="blue" weight={4} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
