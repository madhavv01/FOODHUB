import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../firebase/firebase";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch user details
      const userRef = ref(database, "users/" + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserDetails(data);
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      {user && userDetails ? (
        <>
          <p>Username: {userDetails.displayName}</p>
          <p>User Type: {userDetails.userType}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link to="/login">Login</Link>
          <br />
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
};

export default Home;
