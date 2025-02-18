import React from 'react';

function Game17() {
  return (
    <div style={{ textAlign: 'center' }}>
      <iframe
        title="My JavaScript Game"
        src="/src/components/DodgingGame/index.html"  
        style={{
          width: '100%',
          height: '100vh', 
          border: 'none'
        }}
      />
    </div>
  );
}

export default Game17;
