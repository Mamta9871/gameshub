import React from 'react';

function Game19() {
  return (
    <div style={{ textAlign: 'center' }}>
      <iframe
        title="My JavaScript Game"
        src="/src/components/spot-the-difference/index.html"  
        style={{
          width: '100%',
          height: '100vh', 
          border: 'none'
        }}
      />
    </div>
  );
}

export default Game19;
