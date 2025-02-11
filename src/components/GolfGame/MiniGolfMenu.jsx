import React from 'react';
import styles from './MiniGolfMenu.module.css';

const MiniGolfMenu = ({onPlay,levels,onLevelSelect, currentLevel }) => {
  return (
    <div className={styles.menu}>
        <h2> Mini Golf</h2>
         <div className={styles.levelButtons}>
        {levels.map((level, index)=>(
          <button className={ currentLevel === level.id ? styles.activeLevel : undefined } key={index} onClick={() => onLevelSelect(level.id)}>{level.name}</button>
        ))}
      </div>
       <button className={styles.playButton} onClick={onPlay}>Play</button>
        
    </div>
  );
};

export default MiniGolfMenu;