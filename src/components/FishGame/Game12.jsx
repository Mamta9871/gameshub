// import React, { useRef, useEffect, useState } from 'react';
// import styles from './Game12.module.css';

// const Game12 = () => {
//   const canvasRef = useRef(null);
//   const [hookPosition, setHookPosition] = useState({ x: 0, y: 0 });
//     const [isHookDown, setIsHookDown] = useState(false);
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragStart, setDragStart] = useState({x:0,y:0})

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     // Initial setup
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;
//         let ropeLength = 50;

//     // Define the game objects
//     const player = {
//       x: canvasWidth / 2,
//       y: 30,
//     };


//       const handleMouseDown = (e) => {
//           const mouseX = e.clientX - canvas.offsetLeft;
//           const mouseY = e.clientY - canvas.offsetTop;

//            setHookPosition({ x: player.x, y: player.y + ropeLength});
//           setIsHookDown(true);
//            setDragStart({x:mouseX,y:mouseY});
//       }


//       const handleMouseMove = (e) => {
//           if (isHookDown && isDragging) {
//               const mouseX = e.clientX - canvas.offsetLeft;
//               const mouseY = e.clientY - canvas.offsetTop;
//               const distance = Math.sqrt(
//                   Math.pow(mouseX - dragStart.x, 2) + Math.pow(mouseY-dragStart.y,2)
//               )
//                if (distance > ropeLength) {
//                    // keep at max distance
//                     const angle = Math.atan2(mouseY-dragStart.y,mouseX-dragStart.x);
//                     setHookPosition({ x: dragStart.x + ropeLength*Math.cos(angle) , y: dragStart.y + ropeLength*Math.sin(angle) });
//                }else{
//                    setHookPosition({ x: mouseX, y: mouseY});
//                }
//           }
//       };

//       const handleMouseUp = () => {
//           setIsHookDown(false);
//           setIsDragging(false)

//       };


//         const handleDragStart = (e)=>{
//             if (isHookDown)
//                 setIsDragging(true);
//         }
//         const draw = ()=>{
//             context.clearRect(0, 0, canvasWidth, canvasHeight);
//             //Draw line to hook
//             context.beginPath();
//             context.moveTo(player.x, player.y);
//             context.lineTo(hookPosition.x, hookPosition.y);
//             context.strokeStyle = 'black';
//             context.lineWidth = 2;
//             context.stroke();


//             // Draw player
//             context.beginPath();
//             context.arc(player.x, player.y, 15, 0, 2 * Math.PI);
//             context.fillStyle = 'blue';
//             context.fill();

//             //Draw Hook
//               context.beginPath();
//             context.moveTo(hookPosition.x,hookPosition.y);
//             context.lineTo(hookPosition.x - 10, hookPosition.y+ 10 );
//              context.lineTo(hookPosition.x + 10, hookPosition.y+10);
//               context.closePath();
//             context.fillStyle = 'red';
//             context.fill();


//         }
//     canvas.addEventListener('mousedown', handleMouseDown);
//     canvas.addEventListener('mousemove', handleMouseMove);
//     canvas.addEventListener('mouseup', handleMouseUp);
//     canvas.addEventListener('dragstart', handleDragStart);
//       const animate = () => {
//           requestAnimationFrame(animate);
//         draw();
//       }
//       animate();

//     return () => {
//         canvas.removeEventListener('mousedown', handleMouseDown);
//         canvas.removeEventListener('mousemove', handleMouseMove);
//         canvas.removeEventListener('mouseup', handleMouseUp);
//         canvas.removeEventListener('dragstart', handleDragStart);
//     };
//   }, [hookPosition, isHookDown, isDragging,dragStart]);



//   return (
//     <div className={styles.container}>
//           <canvas id="fishing-canvas"
//                 ref={canvasRef}
//                 className={styles.fishingCanvas}
//                 width={800}
//                 height={600}
//           draggable="true"
//              >
//           </canvas>
//     </div>
//   );
// };

// export default Game12;