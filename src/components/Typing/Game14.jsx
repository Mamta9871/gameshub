import React, { useState, useEffect, useRef } from 'react';
import styles from './Game14.module.css';
import type from './type.mp3'

const generateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const Game14 = () => {
  const [code, setCode] = useState(generateCode());
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [typingSpeed, setTypingSpeed] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);
  const typingAudio = useRef(null);

  useEffect(() => {
    // Initialize the audio element for typing sound
    typingAudio.current = new Audio(type);
  }, []);

  useEffect(() => {
    if (gameOver) {
      inputRef.current.disabled = true;
    } else {
      inputRef.current.disabled = false;
    }
  }, [gameOver]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setUserInput(value);

    if (!startTime) {
      setStartTime(performance.now());
    }

    // Play the typing sound on every input change
    if (typingAudio.current) {
      typingAudio.current.currentTime = 0;
      typingAudio.current.play();
    }

    if (value === code) {
      calculateTypingSpeed();
    }
  };

  const calculateTypingSpeed = () => {
    if (startTime) {
      const endTime = performance.now();
      const timeDiff = (endTime - startTime) / 1000;
      const wordsPerMin = Math.round((code.length / 5 / timeDiff) * 60);
      setTypingSpeed(wordsPerMin);
      setScore((prevScore) => prevScore + 1);
      setCode(generateCode());
      setUserInput('');
      setStartTime(null);
    }
  };

  const resetGame = () => {
    setGameOver(false);
    setCode(generateCode());
    setUserInput('');
    setTypingSpeed(null);
    setScore(0);
    setStartTime(null);
  };

  useEffect(() => {
    if (score >= 20) {
      setGameOver(true);
    }
  }, [score]);

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>Space Repair Typing Challenge</h1>
      <p className={styles.score}>Score: {score}</p>
      <div className={styles.challengeContainer}>
        <p className={styles.challengeText}>
          Type this code:{' '}
          <span className={styles.code}>
            {code}
          </span>
        </p>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type here to repair..."
        />
        {typingSpeed !== null && (
          <p className={styles.typingSpeed}>
            Typing Speed: {typingSpeed} words/min
          </p>
        )}
      </div>
      {gameOver && (
        <div className={styles.gameOverContainer}>
          <h2 className={styles.gameOverTitle}>Mission Success!</h2>
          <p className={styles.gameOverText}>Time to go back to base!</p>
          <button onClick={resetGame} className={styles.button}>
            Restart Mission
          </button>
        </div>
      )}
    </div>
  );
};

export default Game14;
