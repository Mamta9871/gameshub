// import React, { useEffect, useRef, useState } from 'react';
// import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
// import useImage from 'use-image';

// const gameData = {
//   game: { soundsOn: true, FPS_CAP: 80 },
//   chuck: {
//     physicsGravity: 0.25,
//     collisionRadius: 10,
//     jumpRate: 4.5,
//     speedMultiplier: 0,
//     canvasX: 50,
//     canvasY: 150,
//     frames: [
//       { state: "chuckIdle" },
//       { state: "chuckIgnition" },
//       { state: "chuckBlasting" },
//       { state: "chuckIgnition" }
//     ]
//   },
//   obstacle: { safeZoneHeight: 100, maxCanvasY: -200 },
//   sprites: {
//     chuckIdle: { x: 413, y: 114, width: 18, height: 24 },
//     chuckIgnition: { x: 440, y: 114, width: 18, height: 28 },
//     chuckBlasting: { x: 467, y: 114, width: 18, height: 34 },
//     bronzeChuckCoin: { x: 340, y: 161, width: 44, height: 44 },
//     silverChuckCoin: { x: 340, y: 114, width: 44, height: 44 },
//     goldChuckCoin: { x: 293, y: 161, width: 44, height: 44 },
//     platinumChuckCoin: { x: 293, y: 114, width: 44, height: 44 },
//     gameBackground: { x: 0, y: 0, width: 276, height: 228 },
//     gameForeground: { x: 276, y: 0, width: 224, height: 112 },
//     gameCactiDown: { x: 502, y: 0, width: 152, height: 400 },
//     gameCactiUp: { x: 690, y: 0, width: 52, height: 400 },
//     gameReady: { x: 0, y: 228, width: 174, height: 152 },
//     gameOver: { x: 174, y: 228, width: 226, height: 236 },
//     startButton: { x: 0, y: 228, width: 174, height: 152 },
//     gameResults: { x: 0, y: 228, width: 174, height: 152 },
//     deathPoop: { x: 456, y: 152, width: 24, height: 32 },
//     spikes: { x: 415, y: 413, width: 275, height: 14 }
//   },
//   sounds: {
//     SCORE: { file: "/audio/score.wav", playbackSpeed: 1.5, volume: 0.5 },
//     IMPACT: { file: "/audio/impact.wav", playbackSpeed: 1, volume: 1 },
//     JET_PACK: { file: "/audio/jet-pack.wav", playbackSpeed: 4.5, volume: 0.4 },
//     GAME_OVER: { file: "/audio/game-over.wav", playbackSpeed: 1.3, volume: 0.4 }
//   }
// };

// const spriteSheetURL = "/images/sprites/sprite_custom.png";

// function Game13() {
//   const stageWidth = 440;
//   const stageHeight = 500;
//   const [spriteImage] = useImage(spriteSheetURL);
//   const stageRef = useRef(null);
//   const layerRef = useRef(null);
//   const [gameState, setGameState] = useState(0);
//   const READY = 0, PLAYING = 1, OVER = 2;
//   const gameRef = useRef({
//     chuck: {
//       x: gameData.chuck.canvasX,
//       y: gameData.chuck.canvasY,
//       vy: 0,
//       frameIndex: 0,
//       frameTime: 0
//     },
//     bgOffset: 0,
//     fgOffset: 0,
//     obstacles: [],
//     score: 0
//   });
//   const [tick, setTick] = useState(0);
//   useEffect(() => {
//     let animationFrameId;
//     let lastTime = Date.now();
//     const loop = () => {
//       let now = Date.now();
//       let dt = now - lastTime;
//       lastTime = now;
//       if (gameState === PLAYING) {
//         let chuck = gameRef.current.chuck;
//         chuck.vy += gameData.chuck.physicsGravity;
//         chuck.y += chuck.vy;
//         chuck.frameTime += dt;
//         if (chuck.frameTime > 100) {
//           chuck.frameIndex = (chuck.frameIndex + 1) % gameData.chuck.frames.length;
//           chuck.frameTime = 0;
//         }
//         if (chuck.y > stageHeight - gameData.sprites.gameForeground.height - 24) {
//           chuck.y = stageHeight - gameData.sprites.gameForeground.height - 24;
//           setGameState(OVER);
//         }
//         gameRef.current.bgOffset = (gameRef.current.bgOffset - 1) % gameData.sprites.gameBackground.width;
//         gameRef.current.fgOffset = (gameRef.current.fgOffset - 2) % gameData.sprites.gameForeground.width;
//       }
//       setTick(t => t + 1);
//       animationFrameId = requestAnimationFrame(loop);
//     };
//     animationFrameId = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(animationFrameId);
//   }, [gameState]);
//   const handleStageClick = () => {
//     if (gameState === READY) {
//       setGameState(PLAYING);
//     } else if (gameState === PLAYING) {
//       let chuck = gameRef.current.chuck;
//       chuck.vy = -gameData.chuck.jumpRate;
//     } else if (gameState === OVER) {
//       gameRef.current.chuck.x = gameData.chuck.canvasX;
//       gameRef.current.chuck.y = gameData.chuck.canvasY;
//       gameRef.current.chuck.vy = 0;
//       gameRef.current.chuck.frameIndex = 0;
//       gameRef.current.bgOffset = 0;
//       gameRef.current.fgOffset = 0;
//       setGameState(READY);
//     }
//   };
//   const getChuckSprite = () => {
//     let frameName = gameData.chuck.frames[gameRef.current.chuck.frameIndex].state;
//     return gameData.sprites[frameName];
//   };
//   return (
//     <Stage width={stageWidth} height={stageHeight} onClick={handleStageClick} ref={stageRef}>
//       <Layer ref={layerRef}>
//         {spriteImage && (
//           <>
//             <KonvaImage
//               image={spriteImage}
//               x={gameRef.current.bgOffset - gameData.sprites.gameBackground.width}
//               y={stageHeight - 270}
//               width={gameData.sprites.gameBackground.width}
//               height={gameData.sprites.gameBackground.height}
//               crop={{
//                 x: gameData.sprites.gameBackground.x,
//                 y: gameData.sprites.gameBackground.y,
//                 width: gameData.sprites.gameBackground.width,
//                 height: gameData.sprites.gameBackground.height
//               }}
//             />
//             <KonvaImage
//               image={spriteImage}
//               x={gameRef.current.bgOffset}
//               y={stageHeight - 270}
//               width={gameData.sprites.gameBackground.width}
//               height={gameData.sprites.gameBackground.height}
//               crop={{
//                 x: gameData.sprites.gameBackground.x,
//                 y: gameData.sprites.gameBackground.y,
//                 width: gameData.sprites.gameBackground.width,
//                 height: gameData.sprites.gameBackground.height
//               }}
//             />
//             <KonvaImage
//               image={spriteImage}
//               x={gameRef.current.fgOffset - gameData.sprites.gameForeground.width}
//               y={stageHeight - 112}
//               width={gameData.sprites.gameForeground.width}
//               height={gameData.sprites.gameForeground.height}
//               crop={{
//                 x: gameData.sprites.gameForeground.x,
//                 y: gameData.sprites.gameForeground.y,
//                 width: gameData.sprites.gameForeground.width,
//                 height: gameData.sprites.gameForeground.height
//               }}
//             />
//             <KonvaImage
//               image={spriteImage}
//               x={gameRef.current.fgOffset}
//               y={stageHeight - 112}
//               width={gameData.sprites.gameForeground.width}
//               height={gameData.sprites.gameForeground.height}
//               crop={{
//                 x: gameData.sprites.gameForeground.x,
//                 y: gameData.sprites.gameForeground.y,
//                 width: gameData.sprites.gameForeground.width,
//                 height: gameData.sprites.gameForeground.height
//               }}
//             />
//             <KonvaImage
//               image={spriteImage}
//               x={gameRef.current.chuck.x}
//               y={gameRef.current.chuck.y}
//               width={getChuckSprite().width}
//               height={getChuckSprite().height}
//               crop={{
//                 x: getChuckSprite().x,
//                 y: getChuckSprite().y,
//                 width: getChuckSprite().width,
//                 height: getChuckSprite().height
//               }}
//             />
//           </>
//         )}
//         {gameState === READY && (
//           <Text text="Click to Start" fontSize={30} x={stageWidth / 2 - 80} y={stageHeight / 2} fill="white" />
//         )}
//         {gameState === OVER && (
//           <Text text="Game Over - Click to Restart" fontSize={20} x={stageWidth / 2 - 110} y={stageHeight / 2} fill="red" />
//         )}
//       </Layer>
//     </Stage>
//   );
// }

// export default Game13;
