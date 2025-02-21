import React from 'react';
import { Link, Route, Routes } from 'react-router-dom'; 
import styles from './HomePage.module.css';
import Game1 from '../components/InfiniteRunnerGame/Game1' 

const games = [
  { id: 'game1', name: 'Infinite Runner', thumbnail: 'game1.jpg', component: Game1 },
  { id: 'game2', name: 'Word Hunt Puzzle', thumbnail: 'game2.jpg', component: () => <div>Word Hunt Placeholder</div> },
  { id: 'game3', name: 'Tower Builder', thumbnail: 'game3.jpg', component: () => <div>Tower Builder Placeholder</div> },
  { id: 'game4', name: 'Clicker Game', thumbnail: 'game4.jpg', component: () => <div>Clicker Game Placeholder</div> },
  { id: 'game5', name: 'Memory Flip Game', thumbnail: 'game5.jpg', component: () => <div>Memory Flip Game Placeholder</div> },
  { id: 'game6', name: 'Quiz Battle', thumbnail: 'game6.jpg', component: () => <div>Quiz Battle Placeholder</div> },
  { id: 'game7', name: 'Maze Escape', thumbnail: 'game7.jpg', component: () => <div>Maze Escape Placeholder</div> },
  { id: 'game8', name: 'Bubble Pop', thumbnail: 'game8.jpg', component: () => <div>Bubble Pop Placeholder</div> },
  { id: 'game9', name: 'Match-3 Game', thumbnail: 'game9.jpg', component: () => <div>Match-3 Game Placeholder</div> },
  { id: 'game10', name: 'Quick Reaction Game', thumbnail: 'game10.jpg', component: () => <div>Quick Reaction Game Placeholder</div> },
  { id: 'game11', name: 'Shape Fitter Game', thumbnail: 'game11.jpg', component: () => <div>Shape Fitter Game Placeholder</div> },
  { id: 'game12', name: 'Fishing Game', thumbnail: 'game12.jpg', component: () => <div>Fishing Game Placeholder</div> },
  { id: 'game13', name: 'Dodging Game', thumbnail: 'game13.jpg', component: () => <div>Dodging Game Placeholder</div> },
  { id: 'game14', name: 'Typing Speed Challenge', thumbnail: 'game14.jpg', component: () => <div>Typing Speed Challenge Placeholder</div> },
  { id: 'game15', name: 'Digital Board Game', thumbnail: 'game15.jpg', component: () => <div>Digital Board Game Placeholder</div> },
  { id: 'game16', name: 'Stack the Cards', thumbnail: 'game16.jpg', component: () => <div>Stack the Cards Placeholder</div> },
  { id: 'game17', name: 'Balloon Shooter', thumbnail: 'game17.jpg', component: () => <div>Balloon Shooter Placeholder</div> },
  { id: 'game18', name: 'Guess the Drawing', thumbnail: 'game18.jpg', component: () => <div>Guess the Drawing Placeholder</div> },
  { id: 'game19', name: 'Spot the Difference', thumbnail: 'game19.jpg', component: () => <div>Spot the Difference Placeholder</div> },
  { id: 'game20', name: 'Mini Golf Challenge', thumbnail: 'game20.jpg', component: () => <div>Mini Golf Challenge Placeholder</div> },
];

const HomePage = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div className={styles.gameGrid}>
              {games.map((game) => (
                <Link
                  key={game.id}
                  to={`/${game.id}`}
                  className={styles.gameCard}
                >
                  <div className={styles.thumbnail}>
                    <img src={game.thumbnail} alt={game.name} />
                  </div>
                  <h3 className={styles.gameTitle}>{game.name}</h3>
                </Link>
              ))}
            </div>
          }
        />
        {games.map((game) => (
          <Route
            key={game.id}
            path={`/${game.id}`}
            element={<game.component />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default HomePage;