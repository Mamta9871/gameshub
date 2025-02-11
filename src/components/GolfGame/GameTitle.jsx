import React from 'react';
import styles from './GameTitle.module.css';

const GameTitle = ({ type, onClick }) => {
  let content = null;
  let className = styles.tile;

  switch (type) {
    case 'start':
        content = <div className={styles.circle}/>
        className = `${className} ${styles.start}`
        break;
    case 'goal':
      content =  <div className={styles.goal}>
           
            <div className={styles.goalPole} />
            <div className={styles.goalFlag} />
          </div>;
          className = `${className} ${styles.goal}`
      break;
    case 'hole':
        content = <div className={styles.hole}/>
        className = `${className} ${styles.hole}`
        break;
    case 'obstacle':
      content = <div className={styles.obstacle} />;
      className = `${className} ${styles.obstacle}`
      break;
        case 'arrow-left':
           content = <div className={`${styles.arrow} ${styles.arrowLeft}`} />
            className = `${className} ${styles.arrowLeft}`
            break;
        case 'arrow-right':
           content = <div className={`${styles.arrow} ${styles.arrowRight}`} />
           className = `${className} ${styles.arrowRight}`
            break;
        case 'arrow-up':
           content = <div className={`${styles.arrow} ${styles.arrowUp}`} />
           className = `${className} ${styles.arrowUp}`
            break;
    case 'arrow-down':
           content = <div className={`${styles.arrow} ${styles.arrowDown}`} />
            className = `${className} ${styles.arrowDown}`
            break;
    case 'coin':
           content = <div className={styles.coin}/>
           className = `${className} ${styles.coin}`
            break;

    default:
      break;
  }

  return <div className={className} onClick={onClick}>{content}</div>;
};

export default GameTitle;