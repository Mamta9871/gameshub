import React, { useState,useEffect } from 'react';
import styles from './GameBoard.module.css';
import GameTitle from './GameTitle';
import ScoreDisplay from './ScoreDisplay';

const GameBoard = ({ initialLayout,onGameEnd }) => {
  const [boardLayout, setBoardLayout] = useState(initialLayout);
  const [ballPosition, setBallPosition] = useState(findStart(initialLayout));
    const [moves,setMoves] = useState(0)

    useEffect(() => {
       
        if(ballPosition){
             const tileType = boardLayout[ballPosition.row][ballPosition.col];
             if(tileType ==='goal'){
                 onGameEnd(moves)
             }
        }
    },[ballPosition])



 function findStart(layout) {
    for (let row = 0; row < layout.length; row++) {
      for (let col = 0; col < layout[row].length; col++) {
        if (layout[row][col] === 'start') {
          return { row, col };
        }
      }
    }
    return null
  }
  const handleTileClick = (row, col) => {
        if (!ballPosition) return;
        if(Math.abs(row -ballPosition.row ) > 1 || Math.abs(col-ballPosition.col) >1) return
     
       setBallPosition({row,col})
      
      setMoves(moves + 1)
  };

  return (
    <div className={styles.gameBoard}>
        <ScoreDisplay score={moves}/>
      {boardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.boardRow}>
          {row.map((tile, colIndex) => {

              let type = tile;
               if (ballPosition && ballPosition.row === rowIndex && ballPosition.col === colIndex) {
                  type = 'hole'

              }
              return (
              <GameTitle
                key={colIndex}
                type={type}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              />
          )})}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;