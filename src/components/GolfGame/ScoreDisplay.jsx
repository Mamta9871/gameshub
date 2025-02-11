import React from 'react';

const ScoreDisplay = ({ score }) => {
  return (
    <div>
      <p>Moves: {score}</p>
    </div>
  );
};

export default ScoreDisplay;