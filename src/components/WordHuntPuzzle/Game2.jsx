import React, { useState, useEffect } from 'react';
import styles from './Game2.module.css';
import wordbg from '../assets/wordbg.jpg';


import bell from './bell.mp3';
import right_high from './right_high.mp3';
import drag from './drag.mp3';
import fail from './fail.mp3';
import welcome from './welcome.mp3';


const gridSize = 7;


const levels = [
  {
    name: "Fruits",
    words: ["APPLE", "MANGO", "ORANGE", "BANANA", "GRAPES", "CHERRY", "PAPAYA"],
  },
  {
    name: "Places",
    words: ["LONDON", "PARIS", "TOKYO", "SYDNEY", "DELHI", "ROME", "CAIRO"],
  },
  {
    name: "Foods",
    words: ["PIZZA", "BURGER", "FRIES", "SALAD", "DONUT", "SUSHI", "STEAK"],
  },
];

const Game2 = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundCells, setFoundCells] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    generatePuzzle(currentLevel);
    playSound('welcome');
    // eslint-disable-next-line
  }, [currentLevel]);

  const playSound = (soundType) => {
    let audio;
    switch (soundType) {
      case 'drag':
        audio = new Audio(bell);
        break;
      case 'correct':
        audio = new Audio(right_high);
        break;
      case 'wrong':
        audio = new Audio(fail);
        break;
      case 'welcome':
        audio = new Audio(welcome);
        break;
      case 'success':
        audio = new Audio(drag);
        break;
      default:
        audio = null;
    }
    if (audio) {
      audio.play().catch(() => {
        // Some browsers block auto-play if no user interaction
      });
    }
  };

  /**
   * Generate puzzle for the given levelIndex in a 7x7 grid
   */
  const generatePuzzle = (levelIndex) => {
    const wordsForLevel = levels[levelIndex].words;

    // Create an empty 7x7 grid
    let newGrid = Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(''));

    setFoundCells([]);
    setFoundWords(new Set());

    // Attempt to place each word
    for (const word of wordsForLevel) {
      placeWord(word, newGrid);
    }

    // Fill leftover cells with fewer random letters (A..I)
    newGrid = fillEmptyCells(newGrid);
    setGrid(newGrid);
  };

  /**
   * Attempt to place a word in random direction & location, up to 150 attempts
   */
  const placeWord = (word, currentGrid) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];
    for (let attempt = 0; attempt < 150; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const [startX, startY] = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ];
      if (canPlaceWord(word, startX, startY, direction, currentGrid)) {
        placeWordOnGrid(word, startX, startY, direction, currentGrid);
        return true; // stop once placed
      }
    }
    // If it fails all attempts, the word won't appear, but it's less likely now with 150 attempts
    return false;
  };

  /**
   * Check if we can place the word from (startX, startY) in direction (dx, dy)
   */
  const canPlaceWord = (word, startX, startY, [dx, dy], currentGrid) => {
    // Check boundaries
    if (
      startX + dx * (word.length - 1) < 0 ||
      startX + dx * (word.length - 1) >= gridSize ||
      startY + dy * (word.length - 1) < 0 ||
      startY + dy * (word.length - 1) >= gridSize
    ) {
      return false;
    }
    // Check conflicts
    for (let i = 0; i < word.length; i++) {
      const x = startX + dx * i;
      const y = startY + dy * i;
      if (currentGrid[y][x] !== '' && currentGrid[y][x] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  /**
   * Place the letters of the word in the grid
   */
  const placeWordOnGrid = (word, startX, startY, [dx, dy], currentGrid) => {
    for (let i = 0; i < word.length; i++) {
      const x = startX + dx * i;
      const y = startY + dy * i;
      currentGrid[y][x] = word[i];
    }
  };

  /**
   * Fill leftover cells with a smaller set of random letters (A..I)
   */
  const fillEmptyCells = (currentGrid) => {
    const letters = "ABCDEFGHI"; // fewer letters to reduce clutter
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (currentGrid[y][x] === '') {
          currentGrid[y][x] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    return currentGrid;
  };

  // Start selecting cells
  const startSelection = (e) => {
    setIsSelecting(true);
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    setSelectedCells([{ x, y }]);
    playSound('drag');
  };

  // On mouse over, add to selection if adjacent
  const updateSelection = (e) => {
    if (!isSelecting) return;
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);

    // Avoid duplicates
    if (selectedCells.some(cell => cell.x === x && cell.y === y)) {
      return;
    }

    const lastCell = selectedCells[selectedCells.length - 1];
    // allow diagonal (abs difference <=1)
    if (Math.abs(x - lastCell.x) <= 1 && Math.abs(y - lastCell.y) <= 1) {
      setSelectedCells(prev => [...prev, { x, y }]);
      playSound('drag');
    }
  };

  // End selection
  const endSelection = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    const selectedWord = selectedCells.map(cell => grid[cell.y][cell.x]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    const currentWords = levels[currentLevel].words;

    if (currentWords.includes(selectedWord) || currentWords.includes(reversedWord)) {
      const wordToMark = currentWords.includes(selectedWord) ? selectedWord : reversedWord;
      markWordAsFound(wordToMark);
      setFoundCells(prev => [...prev, ...selectedCells]);
      playSound('correct');
    } else {
      playSound('wrong');
    }
    setSelectedCells([]);
    checkGameCompletion();
  };

  // Mark found word in the foundWords set
  const markWordAsFound = (word) => {
    setFoundWords(prev => new Set(prev.add(word)));
  };

  // Check if we found all words in this level
  const checkGameCompletion = () => {
    const currentWords = levels[currentLevel].words;
    if (foundWords.size + 1 >= currentWords.length) {
      playSound('success');
      // Move to next level, or finish if it was the last
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setShowFinalMessage(true);
      }
    }
  };

  // Start over on the same level
  const handleNewPuzzleClick = () => {
    generatePuzzle(currentLevel);
  };

  // If all levels are completed, show a final message
  if (showFinalMessage) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>You Completed All 3 Levels!</h1>
        <p className={styles.congrats}>
          Great job finding all the words, including “CHERRY” and “GRAPES”!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container} onMouseUp={endSelection}>
      {/* background image */}
      <div
        style={{
          backgroundImage: `url(${wordbg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Title */}
      <h1 className={styles.title}>
        Level {currentLevel + 1} - {levels[currentLevel].name}
      </h1>

      <button className={styles.button} onClick={handleNewPuzzleClick}>
        New Puzzle (Same Level)
      </button>

      {/* Puzzle grid */}
      <div className={styles.puzzle}>
        {grid.map((row, y) =>
          row.map((cellValue, x) => {
            const isSelected = selectedCells.some(c => c.x === x && c.y === y);
            const isFound = foundCells.some(c => c.x === x && c.y === y);
            return (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${isSelected ? styles.selected : ''} ${
                  isFound ? styles.found : ''
                }`}
                data-x={x}
                data-y={y}
                onMouseDown={startSelection}
                onMouseOver={updateSelection}
              >
                {cellValue}
              </div>
            );
          })
        )}
      </div>

      {/* Word list */}
      <div className={styles.words}>
        {levels[currentLevel].words.map(word => (
          <div
            key={word}
            className={`${styles.word} ${foundWords.has(word) ? styles.found : ''}`}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game2;
