import React, { useState, useEffect, useRef } from 'react';
import styles from './Game11.module.css';
import xSound from '../BubblePop/high.mp3';
import oSound from '../BubblePop/low.mp3';
const Game11 = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const xAudio = useRef(new Audio(xSound));
  const oAudio = useRef(new Audio(oSound));


  useEffect(() => {
    const calculateWinner = (squares) => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };
    const calculatedWinner = calculateWinner(board);
    setWinner(calculatedWinner);

  }, [board]);


  const handleClick = (index) => {
    if (winner || board[index]) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    if(xIsNext){
        xAudio.current.play();
    } else {
        oAudio.current.play();
    }

    setXIsNext(!xIsNext);
  };

  const renderSquare = (index) => {
    return (
      <button className={styles.square} onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every(square => square !== null)) {
    status = 'It\'s a draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className={styles.game}>
        <h1 className='heading-tic'>Tic Tok Game</h1>
      <div className={styles.gameBoard}>
        {Array(9).fill().map((_, index) => renderSquare(index))}
      </div>
      <div className={styles.gameInfo}>
        <div>{status}</div>
        {winner || board.every(square => square !== null) ? (
          <button onClick={resetGame}>Play Again</button>
        ) : null}
      </div>
    </div>
  );
};

export default Game11;