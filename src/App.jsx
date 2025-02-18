import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Game1 from './components/InfiniteRunnerGame/Game1.jsx';
import Game2 from './components/WordHuntPuzzle/Game2.jsx';
import Game3 from './components/TowerBuilder/Game3.jsx';
import Game4 from './components/ClickerGame/Game4.jsx';
import Game5 from './components/MemoryFlip/Game5.jsx';
import Game6 from './components/QuizBattle/Game6.jsx';
import Game7 from './components/MazeEscape/Game7.jsx';
import Game8 from './components/BubblePop/Game8.jsx';
import Game9 from './components/MatchGames/Game9.jsx';
import Game10 from './components/QuickReact/Game10.jsx';
import Game11 from './components/ShapeFitter/Game11.jsx';
import Game12 from './components/FishGame/Game12.jsx';
import Game13 from './components/DodginGame/Game13.jsx';
import Game14 from './components/Typing/Game14.jsx';
import Game15 from './components/DigitalBoard/Game15.jsx';
import Game16 from './components/Cards/Game16.jsx';
import Game17 from './components/BubbleShooter/Game17.jsx';
import Game18 from './components/GuessDrawing/Game18.jsx';
import Game20 from './components/GolfGame/Game20.jsx';
import Game19 from './components/SpotsDifference/Game19.jsx';
import styles from './App.module.css';

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

const MainApp = () => {
  const location = useLocation();

  // Check if the current route is `/game1`
  const isGame1Active = location.pathname === "/game1";
  

  return (
    <div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navHeader}>Game Hub</Link>
        <div className="flex space-x-4">
          <NavLink to="/leaderboard" className={styles.navLink}>Leaderboard</NavLink>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/game1" element={<Game1 />} />
        <Route path="/game2" element={<Game2 />} />
        <Route path="/game3" element={<Game3 />} />
        <Route path="/game4" element={<Game4 />} />
        <Route path="/game5" element={<Game5 />} />
        <Route path="/game6" element={<Game6 />} />
        <Route path="/game7" element={<Game7 />} />
        <Route path="/game8" element={<Game8 />} />
        <Route path="/game9" element={<Game9 />} />
        <Route path="/game10" element={<Game10 />} />
        <Route path="/game11" element={<Game11 />} />
        <Route path="/game12" element={<Game12 />} />
        <Route path="/game13" element={<Game13 />} />
        <Route path="/game14" element={<Game14 />} />
        <Route path="/game15" element={<Game15 />} />
        <Route path="/game16" element={<Game16 />} />
        <Route path="/game17" element={<Game17 />} />
        <Route path="/game18" element={<Game18 />} />
        <Route path="/game19" element={<Game19 />} />
        <Route path="/game20" element={<Game20 />} />
      </Routes>

      {/* Hide canvas when not on Game1 */}
      <style>
        {`
          Canvas
           {
            display: ${isGame1Active ? "block" : "none"} !important;
          }
        `}
      </style>
    </div>
  );
};

export default App;
