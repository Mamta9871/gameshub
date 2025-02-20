import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; // Ensure you create this file

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.gameBtn}>Game Hub</Link>
      
      <Link to="/" className={styles.backBtn}>
        Back
      </Link>

      <NavLink to="/leaderboard" className={styles.leaderBtn}>Leaderboard</NavLink>
    </nav>
  );
};

export default Navbar;
