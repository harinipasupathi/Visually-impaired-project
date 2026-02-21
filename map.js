import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import L from 'leaflet';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9bDxTWrlXT3BfDYm2-BQ27wJGoLl2iss",
  authDomain: "gps-track-cce25.firebaseapp.com",
  databaseURL: "https://gps-track-cce25-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gps-track-cce25",
  storageBucket: "gps-track-cce25.firebasestorage.app",
  messagingSenderId: "336235832747",
  appId: "1:336235832747:web:5590eb2004d323f3085eee",
  measurementId: "G-8TS578TXL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapPage() {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState([]);

  const handleLogout = () => {
    navigate('/');
  };

  useEffect(() => {
    const coordsRef = ref(database, 'coordinates'); // your database node
    onValue(coordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedCoords = Object.values(data);
        setCoordinates(loadedCoords);
      }
    });
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* Navbar */}
      <nav style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: 'rgba(45, 45, 74, 0.8)',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        color: 'white',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
          Anywhere App
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginRight: '20px' }}>
          <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/details" style={{ color: 'white', textDecoration: 'none' }}>Details</Link>
          <Link to="/map" style={{ color: 'white', textDecoration: 'none' }}>Map</Link>
          <button 
            onClick={handleLogout} 
            style={{
              backgroundColor: '#ff4d4d',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Map Container */}
      <div style={{ height: '100%', paddingTop: '70px' }}>
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={4} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Render Markers from Firebase */}
          {coordinates.map((coord, index) => (
            <Marker key={index} position={[coord.latitude, coord.longitude]}>
              <Popup>
                Lat: {coord.latitude}, Lng: {coord.longitude}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
