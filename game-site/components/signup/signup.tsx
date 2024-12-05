"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/config";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>({ text: "", type: "success" });
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setMessage({
            text: "This email is already in use. Please try a different email.",
            type: "error",
          });
          break;
        case "auth/invalid-email":
          setMessage({
            text: "Invalid email address. Please check and try again.",
            type: "error",
          });
          break;
        case "auth/weak-password":
          setMessage({
            text: "Password is too weak. Please use a stronger password.",
            type: "error",
          });
          break;
        default:
          setMessage({
            text: "An error occurred during sign up. Please try again.",
            type: "error",
          });
      }
    } else if (user) {
      setMessage({
        text: "Sign-up successful! You can now log in.",
        type: "success",
      });
    }
  }, [user, error]);

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength)
      return "Password must be at least 6 characters long.";
    if (!hasLowerCase)
      return "Password must include at least one lowercase letter.";
    if (!hasNumbers) return "Password must include at least one number.";
    if (!hasSpecialChars)
      return "Password must include at least one special character.";

    return "";
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: "", type: "success" });

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage({ text: passwordError, type: "error" });
      return;
    }

    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleClose = () => {
    // Reset state when modal is closed
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage({ text: "", type: "success" });
    onClose();
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "400px",
    bgcolor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    p: 4,
    outline: "none",
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="sign-up-modal-title"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(25, 25, 25, 0.9)",
      }}
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="sign-up-modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            mb: 3,
            color: "#1a1a1a",
          }}
        >
          Sign Up
        </Typography>

        <form
          onSubmit={handleSignUp}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="userCredentialsPrompt-input"
            required
          />
          <div className="password-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="userCredentialsPrompt-input"
              required
            />
            <p className="password-requirements">
              Password must be at least 6 characters long, with a combination of
              letters, numbers, and symbols.
            </p>
          </div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="userCredentialsPrompt-input"
            required
          />
          <button
            type="submit"
            className="userCredentialsPrompt-button"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {message.text && (
          <Typography
            sx={{
              marginTop: "1rem",
              textAlign: "center",
              color: message.type === "success" ? "green" : "red",
              fontSize: "0.9rem",
            }}
          >
            {message.text}
          </Typography>
        )}
        <div className="signup-login-forgot-link">
          <p>
            <button onClick={onLoginClick} className="signup-link">
              Already have an account? Login here!
            </button>
          </p>
        </div>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
