import React from 'react';
import './Leaderboard.css';

const Leaderboard  = () => {
  const mockData = [
    { player: 'Alice', score: 120 },
    { player: 'Bob', score: 100 },
    { player: 'Charlie', score: 80 },
  ];

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.player}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
