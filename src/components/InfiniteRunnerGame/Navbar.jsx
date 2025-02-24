import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; // Ensure this file exists

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    window.location.href = "/"; // Full page reload to properly reset the game state
  };

  return (
    <nav className={styles.nav}>
      <button onClick={handleBack} className={styles.backBtn}>
        Back
      </button>
      <a href="/" className={styles.gameBtn}>Game Hub</a>
      <a href="/leaderboard" className={styles.leaderBtn}>Leaderboard</a>
    </nav>
  );
};

export default Navbar;
