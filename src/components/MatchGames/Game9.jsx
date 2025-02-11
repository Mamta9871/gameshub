import React, { useState, useEffect, useRef } from 'react';
import styles from './Game9.module.css';
import right_med from './right_med.mp3';
import neg from './negative.mp3';
import succes from './succes.mp3';

const emojiTypes = ['😀', '😂', '😍', '😎', '🤯', '😴', '😈', '👽', '👻', '💖'];
const rows = 8;
const cols = 8;

const createBoard = () => {
  const board = [];
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        type: emojiTypes[Math.floor(Math.random() * emojiTypes.length)],
        sparkle: false,
      };
    }
  }
  return board;
};

const Game9 = () => {
  const [board, setBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const boardRef = useRef(null);
  const emojiRef = useRef(null);

  // Audio refs for the different sounds
  const matchSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const completeSoundRef = useRef(null);

  // Initialize the audio objects (update the file paths as needed)
  useEffect(() => {
    matchSoundRef.current = new Audio(right_med);
    wrongSoundRef.current = new Audio(neg);
    completeSoundRef.current = new Audio(succes);
  }, []);

  // Every time the board changes, check for matches
  useEffect(() => {
    checkMatches();
  }, [board]);

  // For demonstration, when score reaches 10 we play a game complete sound.
  useEffect(() => {
    if (score >= 10) {
      completeSoundRef.current.play();
      // Optionally, show a game-complete message or disable further moves.
    }
  }, [score]);

  const handleEmojiDragStart = (event, row, col) => {
    emojiRef.current = { row, col };
    event.dataTransfer.setData('emoji', JSON.stringify({ row, col }));
  };

  const handleEmojiDrop = (event, row, col) => {
    event.preventDefault();
    const droppedEmoji = JSON.parse(event.dataTransfer.getData('emoji'));
    handleEmojiSwap(droppedEmoji.row, droppedEmoji.col, row, col);
    emojiRef.current = null;
  };

  const handleEmojiDragOver = (event) => {
    event.preventDefault();
  };

  // Helper: deep copy the board
  const copyBoard = (board) => board.map(row => row.map(tile => ({ ...tile })));

  // Updated helper: check if a match exists at a given position by counting in both directions.
  const checkForMatchAtPosition = (row, col, currentBoard) => {
    const tile = currentBoard[row][col];
    if (!tile || !tile.type) return false;

    // Count horizontally: left and right of the tile.
    let count = 1;
    let left = col - 1;
    while (left >= 0 && currentBoard[row][left].type === tile.type) {
      count++;
      left--;
    }
    let right = col + 1;
    while (right < cols && currentBoard[row][right].type === tile.type) {
      count++;
      right++;
    }
    if (count >= 3) return true;

    // Count vertically: up and down from the tile.
    count = 1;
    let up = row - 1;
    while (up >= 0 && currentBoard[up][col].type === tile.type) {
      count++;
      up--;
    }
    let down = row + 1;
    while (down < rows && currentBoard[down][col].type === tile.type) {
      count++;
      down++;
    }
    return count >= 3;
  };

  // Swap two emojis; if no match is produced, revert the swap and play a wrong sound.
  const handleEmojiSwap = (fromRow, fromCol, toRow, toCol) => {
    if (fromRow === toRow && fromCol === toCol) return;
    const newBoard = copyBoard(board);
    // Perform the swap
    const temp = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = newBoard[toRow][toCol];
    newBoard[toRow][toCol] = temp;

    // Check if the swap created a match on either tile.
    if (
      checkForMatchAtPosition(fromRow, fromCol, newBoard) ||
      checkForMatchAtPosition(toRow, toCol, newBoard)
    ) {
      // Valid swap: update the board.
      setBoard(newBoard);
      // (The match sound will be played later in checkMatches when a match is processed.)
    } else {
      // No match: play the wrong sound and revert the swap.
      wrongSoundRef.current.play();
      setBoard(board); // Revert (no state change)
    }
  };

  // Check the board for matches and update state accordingly.
  const checkMatches = () => {
    let newBoard = copyBoard(board);
    let foundMatch = false;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const horizontalMatch = checkHorizontalMatch(row, col, newBoard);
        const verticalMatch = checkVerticalMatch(row, col, newBoard);

        if (horizontalMatch.length >= 3) {
          horizontalMatch.forEach(match => {
            newBoard[match.row][match.col].type = null;
            newBoard[match.row][match.col].sparkle = true;
          });
          foundMatch = true;
        }
        if (verticalMatch.length >= 3) {
          verticalMatch.forEach(match => {
            newBoard[match.row][match.col].type = null;
            newBoard[match.row][match.col].sparkle = true;
          });
          foundMatch = true;
        }
      }
    }

    if (foundMatch) {
      // Play match sound, update score, and fill the gaps.
      matchSoundRef.current.play();
      setScore(prevScore => prevScore + 1);
      const updatedBoard = fillGaps(newBoard);
      setBoard(updatedBoard);
    }
  };

  // These functions check for contiguous matches in one direction.
  const checkHorizontalMatch = (row, col, currentBoard) => {
    const emojiType = currentBoard[row]?.[col]?.type;
    if (!emojiType) return [];
    const match = [];
    for (let c = col; c < cols; c++) {
      if (currentBoard[row]?.[c]?.type === emojiType) {
        match.push({ row, col: c });
      } else {
        break;
      }
    }
    return match;
  };

  const checkVerticalMatch = (row, col, currentBoard) => {
    const emojiType = currentBoard[row]?.[col]?.type;
    if (!emojiType) return [];
    const match = [];
    for (let r = row; r < rows; r++) {
      if (currentBoard[r]?.[col]?.type === emojiType) {
        match.push({ row: r, col });
      } else {
        break;
      }
    }
    return match;
  };

  // Make the emojis “fall” to fill gaps and add new ones at the top.
  const fillGaps = (currentBoard) => {
    const newBoard = copyBoard(currentBoard);
    for (let col = 0; col < cols; col++) {
      for (let row = rows - 1; row >= 0; row--) {
        if (newBoard[row][col].type === null) {
          for (let r = row - 1; r >= 0; r--) {
            if (newBoard[r][col].type !== null) {
              newBoard[row][col] = { ...newBoard[r][col] };
              newBoard[r][col] = {
                type: null,
                sparkle: false
              };
              break;
            }
          }
          if (newBoard[row][col].type === null) {
            newBoard[row][col] = {
              type: emojiTypes[Math.floor(Math.random() * emojiTypes.length)],
              sparkle: false,
            };
          }
        }
      }
    }
    return newBoard;
  };

  const resetGame = () => {
    setBoard(createBoard());
    setScore(0);
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Match 3 Game</h1>
      <p>Score: {score}</p>
      <div ref={boardRef} className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.emoji} ${tile.sparkle ? styles.sparkle : ''}`}
              draggable="true"
              onDragStart={(event) => handleEmojiDragStart(event, rowIndex, colIndex)}
              onDrop={(event) => handleEmojiDrop(event, rowIndex, colIndex)}
              onDragOver={handleEmojiDragOver}
              style={{ opacity: tile.type == null ? 0.1 : 1 }}
            >
              {tile.type}
            </div>
          ))
        )}
      </div>
      <button onClick={resetGame} className={styles.button}>Reset Game</button>
    </div>
  );
};

export default Game9;
