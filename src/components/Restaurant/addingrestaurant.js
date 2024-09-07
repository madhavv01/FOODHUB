import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import { AuthContext } from "../../contexts/AuthContext";
import "./Restraunt.css";
import downArrow from "../../assets/DownArrowIcon.png";
import Navbar from "../Navbar";
import logo from "../../assets/logo.png";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [newNote, setNewNote] = useState(""); 
  const [selectedFoodItem, setSelectedFoodItem] = useState(null); 
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [isNotesVisible, setIsNotesVisible] = useState(-1);

  useEffect(() => {
    const restaurantRef = ref(database, `restaurants/${id}`);
    onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let foodItems = data.foodItems.map((item) => ({
          ...item,
          notes: Array.isArray(item.notes) ? item.notes : [], // notes is array
        }));
        
        fetchFoodImages(foodItems)
          .then((updatedFoodItems) => {
            setRestaurant({ id, ...data, foodItems: updatedFoodItems });
          })
          .catch((error) => {
            console.error("Error fetching food images:", error);
            setRestaurant({ id, ...data, foodItems });
          });
      }
    });
  }, [id]);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, "users/" + user.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserDetails(data);
      });
    }
  }, [user]);

}