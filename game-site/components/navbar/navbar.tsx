"use client";

import { useState } from 'react';
import Link from 'next/link';
//import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">GameTracker</Link>
      </div>
      <button className={styles.menuButton} onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/games">Games</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
