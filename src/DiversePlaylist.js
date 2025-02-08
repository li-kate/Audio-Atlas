import React from 'react';

function DiverseSongs() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="http://localhost:8501"
        title="Diverse Songs"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
}

export default DiverseSongs;