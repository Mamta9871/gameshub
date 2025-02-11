import React, { useState, useEffect } from "react";
import styles from "./Game19.module.css";
import diafores1 from './images/diafores1.jpg';

const Game19 = () => {
  const [differences, setDifferences] = useState([
    { x: 50, y: 100, found: false },
    { x: 200, y: 150, found: false },
    { x: 350, y: 250, found: false },
  ]);
  const [foundCount, setFoundCount] = useState(0);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setDifferences((prevDifferences) =>
      prevDifferences.map((diff) => {
        if (!diff.found && Math.abs(diff.x - clickX) < 20 && Math.abs(diff.y - clickY) < 20) {
          setFoundCount((prevCount) => prevCount + 1);
          return { ...diff, found: true };
        }
        return diff;
      })
    );
  };

  return (
    <div className={styles.gameContainer}>
      <h2>Spot the Differences ({foundCount}/{differences.length})</h2>
      <div className={styles.imageContainer} onClick={handleImageClick}>
        <img src={diafores1} alt="Original" className={styles.image} />
        <div className={styles.overlay}>
          {differences.map((diff, index) =>
            diff.found ? (
              <div
                key={index}
                className={styles.marker}
                style={{ left: `${diff.x}px`, top: `${diff.y}px` }}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Game19;
