import React from 'react';
import Layout from './Layout';

function Home() {
  return (
    <Layout>
      <div style={{
        backgroundColor: 'rgba(45, 45, 74, 0.85)',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: 'auto',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <h1>Welcome to Anywhere App!</h1>
        <p style={{ fontSize: '18px', marginTop: '20px' }}>
          Helping guardians track and assist blind individuals with real-time location updates.
        </p>
        <p style={{ fontSize: '16px', marginTop: '15px' }}>
          Stay connected, stay informed — providing peace of mind to both guardians and their loved ones.
        </p>
      </div>
    </Layout>
  );
}

export default Home;
