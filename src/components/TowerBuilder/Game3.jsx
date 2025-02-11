// import React, { useState, useEffect, useRef } from 'react';
// import styles from './Game3.module.css';

// import background from './background.png';
// import block from './block.png';
// import playButton from './playButton.png';
// import towerBase from './towerBase.png';
// import crane from './crane.png';
// import heart from './heart.png';


// const Game3 = () => {
//   const [blocks, setBlocks] = useState([{
//     id: 0,
//     width: 80,
//     height: 35,
//     left: 10,
//     isMoving: true,
//     direction: 'right',
//     isDropped: false,
//   }]);
//   const [score, setScore] = useState(0);
//   const [lives, setLives] = useState(3);
//     const [gameOver, setGameOver] = useState(false);
//     const [animationFrameId, setAnimationFrameId] = useState(null);
//   const [gameStarted, setGameStarted] = useState(false);
//   const blocksRef = useRef(blocks); // to have a mutable variable inside useEffect scope

//   useEffect(() => {
//     blocksRef.current = blocks;
//   }, [blocks]);

//   const blockSpeed = 2;
//   const towerBaseHeight = 100;

//     const gameLoop = () => {
//         if (gameOver) return;

//         setBlocks(prevBlocks => prevBlocks.map((block) => {
//             if (block.isMoving) {
//                 let newLeft = block.left;
//                 if (block.direction === 'right') {
//                     newLeft = newLeft + blockSpeed;
//                     if (newLeft > 290 - block.width) {
//                         return { ...block, direction: 'left' }
//                     }
//                 } else {
//                     newLeft = newLeft - blockSpeed;
//                     if (newLeft < 0) {
//                         return { ...block, direction: 'right' }
//                     }
//                 }
//                 return { ...block, left: newLeft }
//             }
//             return block
//         }));

//         setAnimationFrameId(requestAnimationFrame(gameLoop));
//     };

//   useEffect(() => {
//       if (gameStarted) {
//           setAnimationFrameId(requestAnimationFrame(gameLoop));
//       }
//       return () => cancelAnimationFrame(animationFrameId);
//   }, [gameStarted, gameOver]);

//     const dropBlock = () => {
//         if (gameOver) return;

//         setBlocks(prevBlocks => {
//             const lastBlock = prevBlocks[prevBlocks.length - 1];

//             if (!lastBlock.isMoving) return prevBlocks;

//             const previousBlock = prevBlocks.length > 1 ? prevBlocks[prevBlocks.length - 2] : {
//                 left: 0,
//                 width: 300,
//             };

//             const overlapStart = Math.max(lastBlock.left, previousBlock.left);
//             const overlapEnd = Math.min(lastBlock.left + lastBlock.width, previousBlock.left + previousBlock.width);
//             const overlapWidth = Math.max(0, overlapEnd - overlapStart);

//              if (overlapWidth <= 0) {
//                 setLives(prevLives => {
//                     const newLives = prevLives - 1;
//                    if(newLives <= 0) {
//                        setGameOver(true);
//                        return 0
//                    }
//                     return newLives
//                 })
//                 return prevBlocks
//              } else {
//                 const newBlockWidth = overlapWidth;
//                 const newBlockLeft = overlapStart;

//                 setScore(prevScore => prevScore + 10);

//                 return [
//                     ...prevBlocks,
//                     {
//                         id: prevBlocks.length,
//                         width: newBlockWidth,
//                         height: 35,
//                         left: newBlockLeft,
//                         isMoving: true,
//                         direction: 'right',
//                         isDropped: false,
//                     },
//                 ];
//             }
//         });
//     };


//     const startGame = () => {
//         setGameStarted(true);
//     };

//     const resetGame = () => {
//         setBlocks([{
//             id: 0,
//             width: 80,
//             height: 35,
//             left: 10,
//             isMoving: true,
//             direction: 'right',
//             isDropped: false,
//         }]);
//         setScore(0);
//         setLives(3)
//         setGameOver(false);
//         setGameStarted(true);
//     };
//   const renderHearts = () => {
//     let hearts = [];
//     for (let i = 0; i < lives; i++) {
//       hearts.push(<img src={heart} key={i} alt="heart" className={styles.heart}/>);
//     }
//     return hearts;
//   };

//   return (
//     <div className={styles.gameContainer} style={{backgroundImage: `url(${background})`}}>
//         {gameStarted ?
//             <div className={styles.gameHeader}>
//                 <div className={styles.layerCounter}>{blocks.length - 1} <span>层</span></div>
//                 <div className={styles.scoreAndLives}>
//                    <div className={styles.livesCounter}> {renderHearts()}</div>
//                     <div className={styles.scoreCounter}>{score} <span>分致</span></div>
//                 </div>
//             </div>
//              : ''}
//       <div className={styles.towerArea}>
//         <img src={towerBase} alt="tower base" className={styles.towerBase} />
//           <img src={crane} alt="crane" className={styles.crane} style={{bottom: `${(blocks.length - 1) * 35 + 100}px`}}/>
//         {blocks.map((block, index) => (
//           <img
//             key={block.id}
//             src={block}
//             alt='block'
//             className={styles.block}
//             style={{
//               width: `${block.width}px`,
//               left: `${block.left}px`,
//               bottom: `${towerBaseHeight + index * block.height}px`,
//             }}
//           />
//         ))}
//       </div>
//         <div className={styles.buttonsContainer}>
//             {!gameStarted ? (
//                 <div className={styles.startButtonContainer}>
//                     <img src={playButton} alt='play'  onClick={startGame} className={styles.playButton}/>
//                     <h1>Tower Game</h1>
//                 </div>) : !gameOver ? (
//                 <button onClick={dropBlock} className={styles.button}>Drop Block</button>
//             ) : (
//                 <div className={styles.gameOverContainer}>
//                     <p>Game Over!</p>
//                     <button onClick={resetGame} className={styles.button}>Play Again</button>
//                 </div>
//             )}
//         </div>
//     </div>
//   );
// };

// export default Game3;