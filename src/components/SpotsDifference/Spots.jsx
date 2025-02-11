// import React, { useState } from 'react';
// import Game19 from './Game19.jsx';

// function Spots() {
//  const [showWinMessage, setShowWinMessage] = useState(false);
//     const image1 = "https://placekitten.com/400/400";
//     const image2 = "https://placekitten.com/405/405"; // slightly different size for example
//   const differences = [
//       {x:10,y:10, width:50,height:50,id:1},
//       {x:200,y:50, width:30,height:30,id:2},
//       {x:300,y:100, width:20,height:60,id:3},
//   ]
//   const handleWin = () =>{
//       setShowWinMessage(true)
//   }
//   return (
//     <div className="App">
//        {showWinMessage ? <h1>You Won!</h1> :
//         <Game19
//            image1={image1}
//           image2={image2}
//            differences={differences}
//             onWin={handleWin}
//         />
//        }
//     </div>
//   );
// }

// export default Spots;