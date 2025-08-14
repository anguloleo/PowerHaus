import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchGymById } from '../../store/gyms'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './GymDetail.css'; 
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useMap } from 'react-leaflet'
import GymClassList from '../GymClassList/GymClassList';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const GymDetail = () => {
  const { gymId } = useParams(); 
  const dispatch = useDispatch();
  const gym = useSelector(state => state.gyms.current);

  useEffect(() => {
    if (gymId) {
      dispatch(fetchGymById(gymId));
    }
  }, [dispatch, gymId]);

  if (!gym) {
    return <div>Loading gym details...</div>;
  }

  return (
    <div className="gym-detail-container">
      <h2>{gym.name}</h2>
      <p><strong>Address:</strong> {gym.address}, {gym.city}, {gym.state} {gym.zip}</p>
      <p><strong>Telephone:</strong> {gym.telephone}</p>
      <p><strong>Hours:</strong> {gym.hours}</p>

      {/* Map */}
      <div className="map-container" >
        <MapContainer
          center={[gym.latitude, gym.longitude]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[gym.latitude, gym.longitude]}>
            <Popup>
              {gym.name}<br />{gym.address}
            </Popup>
          </Marker>
          <ChangeView center={[gym.latitude, gym.longitude]} zoom={15} />
        </MapContainer>
      </div>

      <div className="gym-classes-section">
        <GymClassList />
      </div>

    </div>
  );
};

export default GymDetail;
