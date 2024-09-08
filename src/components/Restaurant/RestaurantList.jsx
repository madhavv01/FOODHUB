import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { database } from "../../firebase/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { AuthContext } from "../../contexts/AuthContext";
import AddRestaurant from "./AddRestaurant";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const restaurantsRef = ref(database, "restaurants");
    const unsubscribe = onValue(restaurantsRef, (snapshot) => {
      const data = snapshot.val();
      const restaurantList = data
        ? Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        : [];
      setRestaurants(restaurantList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddRestaurant = async (newRestaurant) => {
    const restaurantsRef = ref(database, "restaurants");
    const newRestaurantRef = push(restaurantsRef);
    await set(newRestaurantRef, {
      ...newRestaurant,
      ownerId: user.uid,
    });
  };

  return (
    <div>
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <Link to={`/restaurant/${restaurant.id}`}>{restaurant.name}</Link>
          </li>
        ))}
      </ul>
      {user && <AddRestaurant onAddRestaurant={handleAddRestaurant} />}
    </div>
  );
};

export default RestaurantList;
