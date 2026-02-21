  import React from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Blurred Background */}
      <div style={{
        background: "url('/op.png') no-repeat center center fixed",
        backgroundSize: 'cover',
        filter: 'blur(8px)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
      }} />

      {/* Dark Overlay */}
      <div style={{
        backgroundColor: 'rgba(28,28,45,0.5)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
      }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Navbar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2d2d4a',
          padding: '15px 30px',
          color: 'white'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
            Anywhere App
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/details" style={{ color: 'white', textDecoration: 'none' }}>
              Patient Details
            </Link>
            <Link to="/map" style={{ color: 'white', textDecoration: 'none' }}>
              Map Tracking
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <main style={{ padding: '40px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
