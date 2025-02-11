// import React, { useState } from 'react';
// import GameBoard from './GameBoard';
// import MiniGolfMenu from './MiniGolfMenu';

// const levels = [{
//     id:1,
//     name:'Level 1',
//     layout: [
//             ['goal',  'obstacle','obstacle'],
//             ['obstacle','obstacle','obstacle'],
//             ['obstacle','obstacle','start'],
//         ]

// },
// {
//     id:2,
//     name:'Level 2',
//         layout: [
//             ['goal', 'obstacle', 'obstacle','obstacle','obstacle', 'obstacle'],
//             ['obstacle', 'obstacle', 'obstacle','obstacle','obstacle', 'obstacle'],
//            ['obstacle', 'obstacle','start', 'obstacle','obstacle', 'obstacle'],
//             ['obstacle','obstacle','obstacle', 'obstacle','obstacle','obstacle'],
//             ['obstacle','obstacle', 'obstacle','obstacle','obstacle','obstacle'],
//         ]
// },
//     {
//     id:3,
//         name: 'Level 3',
//         layout: [
//             ['goal', 'obstacle', 'obstacle', 'obstacle'],
//             ['obstacle', 'coin', 'obstacle', 'obstacle'],
//             ['obstacle', 'coin', 'arrow-right', 'obstacle'],
//             ['obstacle', 'obstacle', 'arrow-down', 'start'],
//         ]
//     }
// ]

// function Game20() {
//   const [gameStarted, setGameStarted] = useState(false);
//     const [currentLevel,setCurrentLevel] = useState(1)
//     const [score,setScore] = useState(0)


//   const handlePlay = () => {
//     setGameStarted(true);
//   };
//     const handleLevelSelect = (levelId) => {
//         setCurrentLevel(levelId)
//     }

//     const handleGameEnd = (moves) => {
//         setScore(moves)
//     }

//      const handleRestart = () => {
//         setGameStarted(false);
//     }


//   return (
//     <div style={{display:"flex", justifyContent:'center', alignItems:'center',height:'100vh',flexDirection:'column'}}>
//         {!gameStarted ? (
//             <MiniGolfMenu onPlay={handlePlay} levels={levels} onLevelSelect={handleLevelSelect} currentLevel={currentLevel} />
//         ) : (
//             <>
//             <GameBoard initialLayout={levels.find((level) => level.id === currentLevel).layout} onGameEnd={handleGameEnd}/>
//                 {score > 0 && (<div>
//                     <p> You have finished in {score} moves</p>
//                      <button onClick={handleRestart}> Restart </button>
//                  </div>)}
//             </>
//         )}
      
//     </div>
//   );
// }

// export default Game20;