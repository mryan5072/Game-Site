"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../app/firebase/config";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>({ text: "", type: "success" });
  const router = useRouter();

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        text: "Password reset email successfully sent, if an account with that email was found.",
        type: "success",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="userCredentialsPrompt-container">
      <div className="userCredentialsPrompt-form-container">
        <h2 className="userCredentialsPrompt-text-color">
          Reset your password
        </h2>
        <form onSubmit={handleForgot} className="userCredentialsPrompt-form">
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
          {message.text && (
            <p
              className={message.type === "error" ? "error-message" : "message"}
            >
              {message.text}
            </p>
          )}
          <button type="submit" className="userCredentialsPrompt-button">
            Send password reset email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
