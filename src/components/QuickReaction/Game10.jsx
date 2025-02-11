import React, { useState, useEffect, useRef } from 'react';
import styles from './Game10.module.css';
import pop from './pop.mp3';

const clickSound = new Audio(pop);

const Game10 = () => {
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(30);
  const [activeDot, setActiveDot] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [clickedEmoji, setClickedEmoji] = useState(null); 

  const timerRef = useRef(null);
  const emojis = ["😀", "😂", "😍", "😎", "🤩", "😜", "👍", "🔥", "💯", "🎉"];

  const startGame = () => {
    setPoints(0);
    setTime(30);
    setGameOver(false);
    setGameStarted(true);
    setActiveDot(Math.floor(Math.random() * 101));
  };

  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setGameOver(true);
            setGameStarted(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted]);

  const handleDotClick = (index) => {
    if (!gameStarted) return;
    if (index === activeDot) {
      
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {  });

      
      setPoints(prev => prev + 1);
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setClickedEmoji({ index, emoji: randomEmoji });
      setTimeout(() => {
        setClickedEmoji(null);
      }, 500);

      
      let newActive;
      do {
        newActive = Math.floor(Math.random() * 101);
      } while (newActive === activeDot);
      setActiveDot(newActive);
    }
  };

  const formatTime = (seconds) => {
    const s = seconds < 10 ? `0${seconds}` : seconds;
    return `00:${s}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.time}>{formatTime(time)}</div>
        <div className={styles.points}>{points}</div>
      </div>

      <div className={styles.wall}>
        {Array.from({ length: 101 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === activeDot ? styles.active : ''}`}
            onClick={() => handleDotClick(i)}
          >
            {clickedEmoji && clickedEmoji.index === i ? clickedEmoji.emoji : ''}
          </div>
        ))}

        {!gameStarted && !gameOver && (
          <div className={styles.start}>
            <button onClick={startGame}>START GAME!</button>
          </div>
        )}

        {gameOver && (
          <div className={styles.end}>
            <div className={styles.score}>
              Game over!<br />
              You scored {points} points!
            </div>
            <button onClick={startGame}>Play again!</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game10;
