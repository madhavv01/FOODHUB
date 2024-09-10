import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import logo from "../assets/LogoTransparent.png";
const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    if (user) {
      const userRef = ref(database, "users/" + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserDetails(data);
      });
    }
  }, [user]);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src={logo} 
          alt="Logo"
          style={{ width: 100, height: 40 }}
        />
      </div>
      <div className="navbar-right">
        <span className="navbar-name">{userDetails?.displayName}</span>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
