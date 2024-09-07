import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link } from "react-router-dom";
import BgImage from "../assets/BgImage.jpg";
import "./AuthStyles.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("password reset link sent to your email.");
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        setMessage("");
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <img
          className="concord-img vlv-creative auth-image"
          src={BgImage}
          alt="Background"
        />
        <div className="overlay"></div>
      </div>
      <form className="auth-form" onSubmit={handlePasswordReset}>
        <h2>Reset Password</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
        <p>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default PasswordReset;
