"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/config";
import { useRouter } from "next/navigation";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>({ text: "", type: "success" });
  const router = useRouter();

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
        text: "Sign-up successful! Redirecting to userCredentialsPrompt page...",
        type: "success",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [user, error, router]);

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

  return (
    <div className="userCredentialsPrompt-container">
      <div className="userCredentialsPrompt-form-container">
        <h2 className="userCredentialsPrompt-text-color">Sign Up</h2>
        <form onSubmit={handleSignUp} className="userCredentialsPrompt-form">
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
          <p className={message.type === "error" ? "error-message" : "message"}>
            {message.text}
          </p>
        )}
        <p className="userCredentialsPrompt-text-color">
          Already have an account?{" "}
          <Link href="/login" className="signup-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
