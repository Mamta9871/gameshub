import React, { useState, useEffect } from 'react';
import styles from './Game5.module.css';
import cheer from "./cheer.mp3";
import right_med from './right_med.mp3';
import welcome from './welcome.mp3';
// import wrong from './wrong.mp3';

const emojis = ['😀', '😂', '😍', '😎', '🤯', '😴', '😈', '👽'];

const Game5 = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    const initialCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length !== 0) {
      setTimerActive(false);
      setGameOver(true);
      playSound('gameComplete');
    }
  }, [matchedCards, cards]);

  const playSound = (soundType) => {
    let audio;
    if (soundType === 'cardFlip') {
      audio = new Audio(welcome);
    } else if (soundType === 'matchFound') {
      audio = new Audio(right_med);
    } else if (soundType === 'gameComplete') {
      audio = new Audio(cheer);
    }

    if (audio) {
      audio.play().catch(()=>{
        
      });
    }
  };

  const handleCardClick = (card) => {
    if (gameOver) return;
    if (flippedCards.length === 2 || card.isFlipped || card.isMatched) return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);
    setFlippedCards([...flippedCards, card]);
    setMoves((prevMoves) => prevMoves + 1);
    playSound('cardFlip');
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setMatchedCards((prevMatched) => [...prevMatched, firstCard, secondCard]);
          setFlippedCards([]);
          setScore((prevScore) => prevScore + 10);
          playSound('matchFound');
        }, 500);
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((card) =>
            flippedCards.some((fc) => fc.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
          playSound('wrongMatch');
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const resetGame = () => {
    const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    const initialCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setTimerActive(true);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Emoji Memory Game</h1>
      <div className={styles.scoreContainer}>
        <p>Moves: {moves}</p>
        <p>Score: {score}</p>
      </div>
      <div>Time: {time} sec</div>

      {/* Success Modal */}
      {gameOver && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <h2>You Won!</h2>
            <p>Time taken: {time} sec</p>
            <p>Score: {score}</p>
            <div className={styles.flyIconsContainer}>
              <div className={styles.flyIcon}>🎈</div>
              <div className={styles.flyIcon}>🎉</div>
              <div className={styles.flyIcon}>✨</div>
              <div className={styles.flyIcon}>🎊</div>
              <div className={styles.flyIcon}>🎈</div>
            </div>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}

      {/* Cards Container */}
      {!gameOver && (
        <div className={styles.cardsContainer}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`${styles.card} ${card.isFlipped ? styles.flipped : ''} ${
                card.isMatched ? styles.matched : ''
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>{card.isFlipped || card.isMatched ? card.emoji : ''}</div>
                <div className={styles.cardBack}>{'❓'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Game5;
