"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/config";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });

  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error
  ] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setMessage({ text: "This email is already in use. Please try a different email.", type: 'error' });
          break;
        case 'auth/invalid-email':
          setMessage({ text: "Invalid email address. Please check and try again.", type: 'error' });
          break;
        case 'auth/weak-password':
          setMessage({ text: "Password is too weak. Please use a stronger password.", type: 'error' });
          break;
        default:
          setMessage({ text: "An error occurred during sign up. Please try again.", type: 'error' });
      }
    } else if (user) {
      setMessage({ text: "Sign-up successful!", type: 'success' });
    }
  }, [user, error]);

  const validatePassword = (password: string) => {
    // Add your custom password validation rules here
    const minLength = 6;
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 6 characters long.";
    if (!hasLowerCase) return "Password must include at least one lowercase letter.";
    if (!hasNumbers) return "Password must include at least one number.";
    if (!hasSpecialChars) return "Password must include at least one special character.";
    
    return ""; // No errors
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: '', type: 'success' });

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: 'error' });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage({ text: passwordError, type: 'error' });
      return;
    }

    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage({ text: "An unexpected error occurred. Please try again later.", type: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <div style={styles.passwordContainer}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <p style={styles.passwordRequirements}>
              Password must be at least 6 characters long, with a combination of letters, numbers and symbols.
            </p>
          </div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {message.text && (
          <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
            {message.text}
          </p>
        )}
        <p>
          Already have an account? <Link href="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "rgb(25, 25, 25)",
  },
  formContainer: {
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "0.8rem",
    borderRadius: "4px",
    backgroundColor: "#0070f3",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  passwordRequirements: {
    fontSize: "0.75rem",
    color: "#666",
    marginTop: "0.25rem",
    textAlign: "center",
    lineHeight: "1.2",
    width: "100%",
  },
};

export default SignUpPage;
