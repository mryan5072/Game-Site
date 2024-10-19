"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../app/firebase/config";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="userCredentialsPrompt-container">
      <div className="userCredentialsPrompt-form-container">
        <h2 className="userCredentialsPrompt-text-color">Login</h2>
        <form onSubmit={handleLogin} className="userCredentialsPrompt-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="userCredentialsPrompt-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="userCredentialsPrompt-input"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="userCredentialsPrompt-button">
            Login
          </button>
        </form>
        <p className="userCredentialsPrompt-text-color">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="signup-link">
            Sign up here
          </Link>
        </p>
        <p className="userCredentialsPrompt-text-color">
          Forgot your password?{" "}
          <Link href="/forgot" className="signup-link">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
