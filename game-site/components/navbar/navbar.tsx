"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, signOut } from 'firebase/auth';
import { auth } from '../../app/firebase/config';
import "../../app/globals.css";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const username = user?.email?.split("@", 1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Game Tracker</div>
      <div className="navbar-links">
        <Link href="/" className="navbar-link">home</Link>
        <Link href="/about" className="navbar-link">about</Link>
        <Link href="/mylist" className="navbar-link">my list</Link>
        {user ? (
          <>
            <div className="user-info">
              <span className="navbar-link">welcome, {username}</span>
              <button onClick={handleSignOut} className="navbar-link sign-out-button">sign out</button>
            </div>
          </>
        ) : (
          <Link href="/login" className="navbar-link">log in</Link>
        )}
        </div>
    </nav>
  );
};

export default Navbar;