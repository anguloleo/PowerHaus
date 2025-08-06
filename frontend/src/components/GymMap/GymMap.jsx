import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



export default function GymMap() {
    console.log("GymMap component mounted!");
  const [gyms, setGyms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch gyms from backend
    async function fetchGyms() {
      try {
        const response = await fetch('/api/gyms');
        if (!response.ok) throw new Error('Failed to fetch gyms');
        const data = await response.json();
        
        setGyms(data.gyms);
      } catch (error) {
        console.error('Error loading gyms:', error);
      }
    }
    fetchGyms();
  }, []);

  return (
    <div style={{ width: '100%', height: '600px', border: '2px solid red' }} className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[34.0522, -118.2437]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            position={[gym.latitude, gym.longitude]}
            eventHandlers={{
              click: () => {
                navigate(`/gyms/${gym.id}`);
              },
            }}
          >
            <Popup>
              <strong>{gym.name}</strong>
              <br />
              Click to view gym
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
