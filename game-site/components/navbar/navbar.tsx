"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, signOut } from 'firebase/auth';
import { auth } from '../../app/firebase/config';
import "../../app/globals.css";
import { Menu, MenuItem, Avatar, Tooltip, IconButton, Divider, Typography, Box, ListItemIcon } from '@mui/material';
import LoginModal from '../login/login';
import ForgotModal from '../forgotpassword/forgotpassword';
import SignUpModal from '../signup/signup';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const router = useRouter();
  const username = user?.email?.split("@", 1)[0];
  const open = Boolean(anchorEl);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleClose();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/" className="navbar-title-link">Game Tracker</Link>
      </div>
      <div className="navbar-links">
        <Link href="/about">about</Link>
        <Link href="/mylist">my list</Link>
        {user ? (
          <div className="user-container">
            <Tooltip title="account">
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>{username?.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  bgcolor: 'rgb(36, 25, 78)',
                  color: 'white',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                account settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut}>
                sign out
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="navbar-link-button"
          >
            log in
          </button>
        )}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onForgotPasswordClick={() => {
            setIsLoginModalOpen(false);
            setIsForgotPasswordModalOpen(true);
          }}
          onSignUpClick={() => {
            setIsLoginModalOpen(false);
            setIsSignUpModalOpen(true);
          }}
        />
        <ForgotModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
          onLoginClick={() => {
            setIsForgotPasswordModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onLoginClick={() => {
            setIsSignUpModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;