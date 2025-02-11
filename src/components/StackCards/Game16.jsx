// // CardPyramid.jsx
// import React, { useState } from 'react';
// import styles from './Game16.module.css';

// function Game16() {
//     // State for card deck
//     const [deck, setDeck] = useState(() => {
//         const suits = ['H', 'D', 'C', 'S'];
//         const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
//         const generatedDeck = [];
//         for (const suit of suits) {
//             for (const rank of ranks) {
//                 generatedDeck.push({ id: `${suit}-${rank}`, rank, suit });
//             }
//         }
//         // Shuffle deck using Fisher-Yates algorithm
//         for (let i = generatedDeck.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [generatedDeck[i], generatedDeck[j]] = [generatedDeck[j], generatedDeck[i]];
//         }
//         return generatedDeck;
//     });


//     // State for the pyramid structure (example, can customize further)
//     const [pyramid, setPyramid] = useState(() => {
//         const pyramidStructure = [
//             [{card: deck[0], location: 'pyramid', row: 0, col: 0}],
//             [{card: deck[1], location: 'pyramid', row: 1, col: 0}, {card: deck[2], location: 'pyramid', row: 1, col: 1}],
//             [{card: deck[3], location: 'pyramid', row: 2, col: 0}, {card: deck[4], location: 'pyramid', row: 2, col: 1}, {card: deck[5], location: 'pyramid', row: 2, col: 2}]
//         ];
//          // remove the cards used in the pyramid from the deck
//         const newDeck = [...deck].slice(pyramidStructure.flat().length)
//          setDeck(newDeck)
//         return pyramidStructure
//     });

//      //State for discard pile
//      const [discardPile, setDiscardPile] = useState([])

//     // Function to handle drag start event
//     const handleDragStart = (e, card) => {
//         e.dataTransfer.setData('cardId', card.id);
//     };

//     // Function to handle drag over event
//     const handleDragOver = (e) => {
//         e.preventDefault(); // Allow drop
//     };

//    // Function to handle card drop in pyramid
//     const handlePyramidDrop = (e, row, col) => {
//       const cardId = e.dataTransfer.getData('cardId');
//        const draggedCard =  discardPile.find(card => card.id === cardId) ||  deck.find(card => card.id === cardId)

//         if (!draggedCard) {
//             return; // Do nothing if card not found
//         }

//         const newPyramid = pyramid.map( (pyramidRow, pyramidRowIndex) => {
//             return pyramidRow.map((pyramidCard, pyramidColIndex) => {
//                 if(pyramidRowIndex === row && pyramidColIndex === col) {
//                     return {...pyramidCard, card: draggedCard, location: 'pyramid', }
//                 } else {
//                     return pyramidCard
//                 }
//             })
//         })
//         setPyramid(newPyramid)


//       if(discardPile.find(card => card.id === cardId)) {
//         setDiscardPile(discardPile.filter(card => card.id !== cardId))
//       } else {
//         setDeck(deck.filter(card => card.id !== cardId))
//       }
//     };


//     // Function to handle card drop in discard
//     const handleDiscardDrop = (e) => {
//         const cardId = e.dataTransfer.getData('cardId');
//         const draggedCard =  deck.find(card => card.id === cardId) || pyramid.flat().find(card => card.card.id === cardId)
//         if (!draggedCard) {
//             return;
//         }

//         setDiscardPile([...discardPile, draggedCard])

//         if(pyramid.flat().find(card => card.card.id === cardId)) {

//            const newPyramid = pyramid.map( (pyramidRow) => {
//             return pyramidRow.map((pyramidCard) => {
//                if(pyramidCard.card.id === cardId) {
//                     return {...pyramidCard, card: null}
//                 } else {
//                    return pyramidCard
//                 }
//             })
//          })

//            setPyramid(newPyramid)
//         } else {
//             setDeck(deck.filter(card => card.id !== cardId))
//         }
//     };

//    //Function to render card
//   const renderCard = (card) => {
//       if (!card) return null;
//        return (
//         <div className={styles.card}
//              key={card.id}
//              draggable
//              onDragStart={(e) => handleDragStart(e, card)} >
//             {card.rank} {card.suit}
//         </div>
//        )
//   }

//     return (
//         <div className={styles.gameContainer}>
//             <div className={styles.pyramid}>
//                 {pyramid.map((row, rowIndex) => (
//                     <div key={rowIndex} className={styles.pyramidRow}>
//                         {row.map((cardData, colIndex) => (
//                            <div key={colIndex}
//                              className={styles.pyramidCell}
//                              onDragOver={handleDragOver}
//                              onDrop={(e) => handlePyramidDrop(e, rowIndex, colIndex)}>
//                                    {renderCard(cardData.card)}
//                                 </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//              <div className={styles.deckContainer}  onDragOver={handleDragOver} onDrop={handleDiscardDrop} >
//                 <h3>Deck:</h3>
//                     {deck.map(card =>  renderCard(card)
//                     )}
//                 </div>
//             <div className={styles.discardContainer} onDragOver={handleDragOver} onDrop={handleDiscardDrop}>
//               <h3>Discard</h3>
//                 {discardPile.map(card =>  renderCard(card)
//                     )}
//              </div>
//         </div>
//     );
// }

// export default Game16;