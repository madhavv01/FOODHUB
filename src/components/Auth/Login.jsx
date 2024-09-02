// import React, { useState, useContext } from "react";
// import { auth } from "../../firebase/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { AuthContext } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/");
//     } catch (error) {
//       setError("Failed to log in");
//       console.error(error);
//     }
//   };

//   if (user) {
//     navigate("/");
//     return null;
//   }

//   return (
//     <div>
//       <h2>Login</h2>
//       {error && <p>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [activePanel, setActivePanel] = useState('user');

  const renderLoginForm = (userType) => (
    <form className="login-form">
      <h2>{userType} Login</h2>
      <input type="text" placeholder="Username" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );

  return (
    <div className="login-page">
      <div className="toggle-buttons">
        <button 
          className={activePanel === 'admin' ? 'active' : ''}
          onClick={() => setActivePanel('admin')}
        >
          Admin
        </button>
        <button 
          className={activePanel === 'owner' ? 'active' : ''}
          onClick={() => setActivePanel('owner')}
        >
          Owner
        </button>
        <button 
          className={activePanel === 'user' ? 'active' : ''}
          onClick={() => setActivePanel('user')}
        >
          User
        </button>
      </div>
      <div className="panel-container">
        <div className={`panel ${activePanel === 'admin' ? 'active' : ''}`}>
          {renderLoginForm('Admin')}
        </div>
        <div className={`panel ${activePanel === 'owner' ? 'active' : ''}`}>
          {renderLoginForm('Owner')}
        </div>
        <div className={`panel ${activePanel === 'user' ? 'active' : ''}`}>
          {renderLoginForm('User')}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;