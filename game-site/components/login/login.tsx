"use client";
import React, { useState } from "react";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for login logic
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="loginsignup-text-color">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="loginsignup-text-color">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="signup-link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;