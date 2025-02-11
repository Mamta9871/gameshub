import React, { useState, useEffect, useRef } from 'react';
import styles from './Game6.module.css';
import right_high from './right_high.mp3';
import neg from './neg.mp3';
import theme from './theme.mp3';

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Paris', 'Madrid', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Mars', 'Earth', 'Jupiter', 'Saturn'],
    correctAnswer: 'Jupiter',
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 'Leonardo da Vinci',
  },
  {
    question: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctAnswer: 'H2O',
  },
  {
    question: 'Which country is known as the Land of the Rising Sun?',
    options: ['China', 'South Korea', 'Japan', 'Vietnam'],
    correctAnswer: 'Japan',
  }
];

const Game6 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswerSelected, setCorrectAnswerSelected] = useState(false);

  // Audio refs for correct, wrong, and game complete sounds
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const completeSoundRef = useRef(null);

  useEffect(() => {
    // Initialize audio objects
    correctSoundRef.current = new Audio(right_high);
    wrongSoundRef.current = new Audio(neg);
    completeSoundRef.current = new Audio(theme);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      if (timer === 0) {
        handleNextQuestion();
      }
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setTimerActive(false);
      setGameOver(true);
    }
  }, [currentQuestionIndex]);

  // Play the game complete sound when gameOver becomes true.
  useEffect(() => {
    if (gameOver) {
      completeSoundRef.current.play();
    }
  }, [gameOver]);

  const handleAnswerSelect = (option) => {
    if (gameOver) return;
    setSelectedAnswer(option);
    setTimerActive(false);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setCorrectAnswerSelected(true);
      // Play correct answer sound
      correctSoundRef.current.play();
    } else {
      setCorrectAnswerSelected(false);
      // Play wrong answer sound
      wrongSoundRef.current.play();
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (gameOver) return;
    setTimer(10);
    setSelectedAnswer('');
    setCorrectAnswerSelected(false);
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimerActive(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setTimer(10);
    setTimerActive(true);
    setGameOver(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.gameContainer}>
      <h1>Quiz Battle</h1>
      {gameOver ? (
        <div className={styles.gameOverContainer}>
          <h2>Game Over</h2>
          <p>
            Your Score: {score} / {questions.length}
          </p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className={styles.quizContainer}>
          <h2>{currentQuestion?.question}</h2>
          <div className={styles.optionsContainer}>
            {currentQuestion?.options?.map((option) => (
              <button
                key={option}
                className={`${styles.optionBtn} ${
                  selectedAnswer === option
                    ? correctAnswerSelected
                      ? styles.correct
                      : styles.incorrect
                    : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== ''}
              >
                {option}
              </button>
            ))}
          </div>
          <p>Time left: {timer} sec</p>
          <p>
            Score: {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Game6;
