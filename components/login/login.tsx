import React, { useState } from "react";
import Link from "next/link";
import { 
  Modal, 
  Box, 
  Typography, 
  IconButton 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../app/firebase/config";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  onForgotPasswordClick?: () => void;
  onSignUpClick?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  onForgotPasswordClick,
  onSignUpClick
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
      onLoginSuccess?.();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Login error:", error);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  }

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '400px',
    bgcolor: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    p: 4,
    outline: 'none',
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="login-modal-title"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(25, 25, 25, 0.9)',
      }}
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography 
          id="login-modal-title" 
          variant="h6" 
          component="h2" 
          sx={{ 
            textAlign: 'center', 
            mb: 3,
            color: '#1a1a1a' 
          }}
        >
          Login
        </Typography>
        
        <form 
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="userCredentialsPrompt-input"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="userCredentialsPrompt-input"
          />
          
          {error && (
            <p className="error-message" style={{ textAlign: 'center' }}>
              {error}
            </p>
          )}
          
          <button
            type="submit"
            className="userCredentialsPrompt-button"
          >
            Login
          </button>
        </form>
        
        <div className="signup-login-forgot-link">
          <p>
            <button onClick={onSignUpClick} className="signup-link">
              Sign up here
            </button>
          </p>
          <p>
            <button onClick={onForgotPasswordClick} className="signup-link">
              Forgot password?
            </button>
          </p>
        </div>
      </Box>
    </Modal>
  );
};

export default LoginModal;