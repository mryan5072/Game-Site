"use client";

import React, { useState } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "../../app/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const ForgotModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onLoginClick
}) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>({ text: "", type: "success" });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        text: "Email is sent if the account exists! Please check your inbox and spam.",
        type: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "An unexpected error occurred.", type: "error" });
      }
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage({ text: "", type: "success" });
    setIsSubmitted(false);
    onClose();
  }

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
      aria-labelledby="forgot-password-modal-title"
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
          id="forgot-password-modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: "center",
            mb: 3,
            color: "#1a1a1a",
          }}
        >
          Forgot Password
        </Typography>

        <form
          onSubmit={handleForgot}
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
            required
            className="userCredentialsPrompt-input"
          />

          {isSubmitted && message.text && (
            <Typography
              sx={{
                marginTop: "0.5rem",
                textAlign: "center",
                color: message.type === "success" ? "green" : "red",
                fontSize: "0.9rem",
              }}
            >
              {message.text}
            </Typography>
          )}

          <button
            type="submit"
            className="userCredentialsPrompt-button"
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              background: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send password reset email
          </button>
        </form>
        <div className="signup-login-forgot-link">
        <p>
          <button onClick={onLoginClick} className="signup-link">
                Have an account? Click here to login!
          </button>
        </p>
        </div>
      </Box>
    </Modal>
  );
};

export default ForgotModal;
