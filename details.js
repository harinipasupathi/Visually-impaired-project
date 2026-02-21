import React from 'react';
import Layout from './Layout';

function Details() {
  return (
    <Layout>
      <div style={{
        backgroundColor: 'rgba(45, 45, 74, 0.85)',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '800px',
        margin: 'auto',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <h1>Patient Details</h1>
        <p>Name: John Doe</p>
        <p>Age: 28</p>
        <p>Condition: Visually Impaired</p>
        <p>Guardian Contact: +91 9876543210</p>
      </div>
    </Layout>
  );
}

export default Details;
