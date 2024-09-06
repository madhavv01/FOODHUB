import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../firebase/firebase";
import "./Home.css";
import BgImage from "../assets/BgImage.jpg";
import Navbar from "./Navbar";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch user details
      const userRef = ref(database, "users/" + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserDetails(data);
      });

      // Fetch all restaurants
      const restaurantsRef = ref(database, "restaurants");
      onValue(restaurantsRef, (snapshot) => {
        const data = snapshot.val();
        const restaurantsList = data ? Object.values(data) : [];
        setRestaurants(restaurantsList);
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

  const renderRestaurantList = () => (
    <div className="restaurant-list">
      <h2>Top Restaurants </h2>
      {restaurants?.map((restaurant, index) => (
        <Link
          className="restaurant-link"
          to={`/restaurant/${restaurant.ownerId}`}
        >
          <div key={index} className="restaurant-item">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <h4>Menu Items:</h4>
            <ul>
              {restaurant.foodItems.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="home">
      {user?.uid && <Navbar />}
      {user && userDetails ? (
        <div className="home-page">
          <h1>Welcome to Food Hub</h1>
          <>{renderRestaurantList()}</>
        </div>
      ) : (
        <div className="home-container">
          <div className="auth-background">
            <img
              className="concord-img vlv-creative auth-image"
              src={BgImage}
              alt=""
            />
            <div className="overlay"></div>
          </div>
          <div className="home-page">
            <h2 className="home-welcome">Welcome to Food Hub</h2>
          </div>
          <div className="home-login">
            {/* <p>You are not logged in.</p> */}
            <Link to="/login">Login</Link>
            <br />
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
