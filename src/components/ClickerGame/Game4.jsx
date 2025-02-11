import React, { useState, useEffect, useRef } from 'react';
import styles from './Game4.module.css';
import point from './point.mp3';
const Game4 = () => {
  const [petSize, setPetSize] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [level, setLevel] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(5);
  // Create a ref for the click sound
  const clickAudio = useRef(null);

  useEffect(() => {
    // Initialize the audio element
    clickAudio.current = new Audio(point);
  }, []);

  const handlePetClick = () => {
    // Play the click sound
    if (clickAudio.current) {
      // Reset the audio in case it's still playing
      clickAudio.current.currentTime = 0;
      clickAudio.current.play();
    }
    setClicks((prev) => prev + 1);
    setPetSize((prev) => prev + 0.1); // Increment pet size slightly on click
  };

  const handleUpgrade = () => {
    if (clicks >= upgradeCost) {
      setClicks((prev) => prev - upgradeCost);
      setLevel((prev) => prev + 1);
      setUpgradeCost(Math.round(upgradeCost * 1.8));
    } else {
      alert("You don't have enough clicks for upgrade!");
    }
  };

  useEffect(() => {
    if (petSize >= level * 10) {
      setPetSize(1);
      setLevel((prev) => prev + 1);
    }
  }, [petSize, level]);

  return (
    <div className={styles.gameContainer}>
      <h1>Digital Pet Clicker</h1>
      <div className={styles.petContainer}>
        <h2>Level: {level}</h2>
        <div
          className={styles.pet}
          style={{ width: `${petSize}em`, height: `${petSize}em` }}
          onClick={handlePetClick}
        >
          {/* You can add an image here later */}
          <span>{'\u{1F436}'}</span>
        </div>
      </div>
      <p>Clicks: {clicks}</p>
      <div>
        <button className={styles.upgradeBtn} onClick={handleUpgrade}>
          Upgrade (Cost: {upgradeCost} clicks)
        </button>
      </div>
    </div>
  );
};

export default Game4;
