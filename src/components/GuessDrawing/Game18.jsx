import React, { useState, useRef, useEffect } from 'react';
import styles from './Game18.module.css';
import media_win from './media_win.mp3';
import image1 from './images/1.png';
import image2 from './images/2.png';
import image3 from './images/3.png';
import image4 from './images/4.png';
import image5 from './images/5.png';
import image6 from './images/6.png';
import image7 from './images/7.png';
import image8 from './images/8.png';
import image9 from './images/9.png';


const Game18 = () => {
  const [pieces, setPieces] = useState([
    { id: 0, x: 0, y: 0, width: 134, height: 163, imageUrl: image1 },
    { id: 1, x: 0, y: 0, width: 192, height: 134, imageUrl: image2 },
    { id: 2, x: 0, y: 0, width: 134, height: 163, imageUrl: image3 },
    { id: 3, x: 0, y: 0, width: 163, height: 134, imageUrl: image4 },
    { id: 4, x: 0, y: 0, width: 134, height: 192, imageUrl: image5 },
    { id: 5, x: 0, y: 0, width: 163, height: 134, imageUrl: image6 },
    { id: 6, x: 0, y: 0, width: 134, height: 163, imageUrl: image7 },
    { id: 7, x: 0, y: 0, width: 192, height: 134, imageUrl: image8 },
    { id: 8, x: 0, y: 0, width: 134, height: 163, imageUrl: image9 },
  ]);

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [win,setWin] = useState(false);
  const winAudioRef = useRef(null);


  const origPositions = useRef([
    { x: 200, y: 100 },
    { x: 304, y: 100 },
    { x: 466, y: 100 },
    { x: 200, y: 233 },
    { x: 333, y: 204 },
    { x: 437, y: 233 },
    { x: 200, y: 337 },
    { x: 304, y: 366 },
    { x: 466, y: 337 },
  ]).current;

  useEffect(() => {
    // initial random position
    setPieces((prevPieces) =>
      prevPieces.map(piece => ({
        ...piece,
        x: Math.floor(Math.random() * 10) + 1,
        y: Math.floor(Math.random() * 409) + 1
      }))
    );
  }, []);

  useEffect(() => {
    if(win){
        winAudioRef.current.play();
        setWin(false)
      }
  },[win])
  
  const handleMouseDown = (e, piece) => {
    setSelectedPiece(piece);
    setOffsetX(e.clientX - piece.x);
    setOffsetY(e.clientY - piece.y);

  };

  const handleMouseMove = (e) => {
    if (!selectedPiece) return;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    const updatedPieces = pieces.map((piece) =>
      piece.id === selectedPiece.id ? { ...piece, x: newX, y: newY } : piece
    );
    setPieces(updatedPieces);
    
    handleMagnet(updatedPieces,selectedPiece);

  };

  const handleMouseUp = () => {
    setSelectedPiece(null);
     testing();
  };

  const handleMagnet = (currentPieces,selectedPiece) => {
    const pieceIndex = currentPieces.findIndex(piece => piece.id === selectedPiece.id);
    if (pieceIndex === -1) return;
  
      const piece = currentPieces[pieceIndex];
      const targetPos = origPositions[piece.id];
  
      if (Math.abs(piece.x - targetPos.x) < 15 && Math.abs(piece.y - targetPos.y) < 15) {
          const updatedPieces = currentPieces.map((p,index) =>
           p.id === selectedPiece.id ? { ...p, x: targetPos.x, y: targetPos.y } : p
          );
          setPieces(updatedPieces)
      }
  };
  
  const testing = () => {
    let correctPositions = 0;
  
    pieces.forEach((piece) => {
        const targetPosition = origPositions[piece.id];
      if (piece.x === targetPosition.x && piece.y === targetPosition.y) {
        correctPositions++;
      }
    });
  
    if (correctPositions === pieces.length) {
        setWin(true)
    }
  };
  
  const reorder = (piece) => {
    const updatedPieces = pieces.filter(p => p.id !== piece.id);
    setPieces([...updatedPieces,piece]);
  }

  return (
    <><div className='guess'>
        <h1 className='drawing'>Guess The Drawing</h1>
       <audio id="win" src={media_win} ref={winAudioRef}/>
      <svg width="600" height="600" id="entorno" className={styles.entorno}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <g id="fondo" className={styles.fondo}>
            <image 
                xlinkHref="https://raw.githubusercontent.com/NestorPlasencia/pikachu-puzzle/master//pikachu.png" 
                width="400" 
                height="400" 
                x="200" 
                y="100" 
            />
        </g>
        {pieces.map((piece) => (
          <g key={piece.id} id={piece.id} className={styles.padre}  onMouseDown={()=>reorder(piece)}>
            <image
              xlinkHref={piece.imageUrl}
              className={styles.movil}
              width={piece.width}
              height={piece.height}
              x={piece.x}
              y={piece.y}
              onMouseDown={(e) => handleMouseDown(e, piece)}

            />
          </g>
        ))}
      </svg>
      </div>
    </>
  );
};

export default Game18;