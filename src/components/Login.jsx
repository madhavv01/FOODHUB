import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./AuthStyles.css";
import BgImage from "../assets/BgImage.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activePanel, setActivePanel] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);// error 

    }
  };

  const renderLoginForm = (userType) => (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{userType} Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p>
        Forgot your password? <Link to="/password-reset">Reset Password</Link>
      </p>
    </form>
  );

  return (
    <div className="auth-page">
      <div className="auth-background">
        <img
          className="concord-img vlv-creative auth-image"
          src={BgImage}
          alt=""
        />
        <div className="overlay"></div>
      </div>
      <div className="toggle-buttons">
        <button
          className={activePanel === "admin" ? "active" : ""}
          onClick={() => setActivePanel("admin")}
        >
          Admin
        </button>
        <button
          className={activePanel === "owner" ? "active" : ""}
          onClick={() => setActivePanel("owner")}
        >
          Owner
        </button>
        <button
          className={activePanel === "user" ? "active" : ""}
          onClick={() => setActivePanel("user")}
        >
          User
        </button>
      </div>
      <div className="panel-container">
        <div className={`panel ${activePanel === "admin" ? "active" : ""}`}>
          {renderLoginForm("Admin")}
        </div>
        <div className={`panel ${activePanel === "owner" ? "active" : ""}`}>
          {renderLoginForm("Owner")}
        </div>
        <div className={`panel ${activePanel === "user" ? "active" : ""}`}>
          {renderLoginForm("User")}
        </div>
      </div>
      <div className="auth-toggle">
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
