// import React, { useState, useEffect, useRef } from 'react';
// import styles from './Game7.module.css';
// import useSound from 'use-sound';
// import ambientSound from "../assets/ambient.mp3";
// import ghostSound from '../assets/ghost.mp3';
// import cobwebImage from '../assets/cobweb.png';
// import candleImage from '../assets/candle.png';
// import exitImage from '../assets/exist.png';
// import ghostImage from '../assets/ghost.png';


// const initialMaze = [
//     '##########',
//     '#   ##   #',
//     '# #    # #',
//     '# # # #  #',
//     '# #   #  #',
//     '# ### ## #',
//     '# S    #E#',
//     '##########',
// ];

// const Game7 = () => {
//     const [playerPosition, setPlayerPosition] = useState({ row: 6, col: 1 });
//     const [maze, setMaze] = useState([]);
//     const [gameOver, setGameOver] = useState(false);
//     const [moves, setMoves] = useState(0);
//     const [level, setLevel] = useState(1);
//     const [collectedItems, setCollectedItems] = useState(0);
//     const [playAmbientSound, {stop: stopAmbient}] = useSound(ambientSound, {loop: true});
//     const [playGhostSound] = useSound(ghostSound)

//     const handleMazeChange = () => {
//         const newMaze = [
//             '##########',
//             '#  ####  #',
//             '#  #  #  #',
//             '# #   #  #',
//             '#    #   #',
//             '## ####  #',
//             '#S     #E#',
//             '##########',
//         ]
//        if(level === 2) {
//             setMaze(newMaze.map(row => row.split('')));
//              setPlayerPosition({ row: 6, col: 1 });
//            return
//        }

//         const level2Maze = [
//             '############',
//             '#S       #  #',
//             '# #### # ## #',
//             '# #    #   # #',
//             '# #### # ### #',
//             '# #        # #',
//             '# ####### ## #',
//             '#   #     #E#',
//              '############',
//         ]
//         if (level === 3) {
//             setMaze(level2Maze.map(row => row.split('')));
//              setPlayerPosition({ row: 1, col: 1 });
//            return
//         }
//     }
//    useEffect(() => {
//         playAmbientSound()
//         return () => stopAmbient()
//    },[])

//     useEffect(() => {
//         setMaze(initialMaze.map(row => row.split('')));
//     }, []);


//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if (gameOver) return;
//             let newRow = playerPosition.row;
//             let newCol = playerPosition.col;

//             switch (event.key) {
//                 case 'ArrowUp':
//                     newRow--;
//                     break;
//                 case 'ArrowDown':
//                     newRow++;
//                     break;
//                 case 'ArrowLeft':
//                     newCol--;
//                     break;
//                 case 'ArrowRight':
//                     newCol++;
//                     break;
//                 default:
//                     return;
//             }

//             if (
//                 newRow >= 0 &&
//                 newRow < maze.length &&
//                 newCol >= 0 &&
//                 newCol < maze[0].length &&
//                 maze[newRow][newCol] !== '#'
//             ) {
//                 setPlayerPosition({ row: newRow, col: newCol });
//                 setMoves(prevMoves => prevMoves + 1);
//                 playGhostSound()
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);

//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [playerPosition, maze, gameOver]);


//     useEffect(() => {
//         if (maze[playerPosition.row]?.[playerPosition.col] === 'E') {
//             if(level < 3) {
//                 setCollectedItems(0)
//                 setLevel(prevLevel => prevLevel + 1);
//                 handleMazeChange()

//             } else {
//                  setGameOver(true);
//             }
//         }
//     }, [playerPosition, maze, level]);

//     const renderMaze = () => {
//         return maze.map((row, rowIndex) => (
//             <div key={rowIndex} className={styles.mazeRow}>
//                 {row.map((cell, colIndex) => {
//                     let cellContent = '';
//                     let cellClass = '';
//                     let spookyImages = '';


//                      if(rowIndex === playerPosition.row && colIndex === playerPosition.col) {
//                         cellClass = styles.player
//                         spookyImages =  <img src={ghostImage} alt="player" className={styles.playerImg}/>
//                      } else if (cell === '#'){
//                          cellClass = styles.wall;
//                      } else if (cell === 'E') {
//                         cellClass = styles.exit
//                         spookyImages =  <img src={exitImage} alt='exit' className={styles.exitImg}/>
//                      }

//                   else {
//                          if(Math.random() < 0.1) {
//                             spookyImages = <img src={cobwebImage} alt="cobweb" className={styles.cobweb} />;
//                         }
//                          if(Math.random() < 0.1) {
//                            spookyImages =  <img src={candleImage} alt="candle" className={styles.candle} />
//                        }
//                     }

//                     return (
//                             <div
//                                 key={colIndex}
//                                 className={`${styles.mazeCell} ${cellClass}`}
//                                 style={{ transform: 'perspective(500px) rotateX(30deg)' }}
//                             >{spookyImages}</div>
//                     );
//                 })}
//             </div>
//         ));
//     };


//     const resetGame = () => {
//         setPlayerPosition({ row: 6, col: 1 });
//         setGameOver(false);
//         setMoves(0);
//         setLevel(1);
//         setCollectedItems(0)
//         setMaze(initialMaze.map(row => row.split('')));
//          playAmbientSound()
//     }

//     return (
//         <div className={styles.gameContainer}>
//             <h1>Haunted Maze</h1>
//             {gameOver ? (
//                 <div className={styles.gameOverContainer}>
//                     <h2>You escaped the haunted mansion!</h2>
//                     <p>Total moves: {moves}</p>
//                     <button onClick={resetGame}>Play Again</button>
//                 </div>
//             ) : (
//                 <>
//                     <p>Level: {level}</p>
//                     <p>Moves: {moves}</p>
//                     <div className={styles.mazeGrid}>{renderMaze()}</div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Game7;