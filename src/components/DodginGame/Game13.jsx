// src/components/MyJsGamePage.jsx
import React from 'react';

function Game17() {
  return (
    <div style={{ textAlign: 'center' }}>
      <iframe
        title="My JavaScript Game"
        src="/public/DodgingGame/index.html"  // This path points to your game folder in public
        style={{
          width: '100%',
          height: '100vh', // Adjust as needed
          border: 'none'
        }}
      />
    </div>
  );
}

export default Game17;
