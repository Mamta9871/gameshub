import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; // Ensure you create this file

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.gameBtn}>Game Hub</Link>
      
      <button onClick={() => navigate(-1)} className={styles.back}>
        Back
      </button>

      <NavLink to="/leaderboard" className={styles.leaderBtn}>Leaderboard</NavLink>
    </nav>
  );
};

export default Navbar;
