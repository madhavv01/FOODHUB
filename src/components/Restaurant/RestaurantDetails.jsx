import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import { AuthContext } from "../../contexts/AuthContext";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const restaurantRef = ref(database, `restaurants/${id}`);
    const restaurantUnsubscribe = onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const foodItems = data.foodItems.map((item) => ({
          ...item,
          notes: Array.isArray(item.notes) ? item.notes : [], 
        }));
        setRestaurant({ id, ...data, foodItems });
      }
    });

    return () => {
      restaurantUnsubscribe();
    };
  }, [id]);

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

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (user && newNote.trim() && selectedFoodItem !== null) {
      const updatedFoodItems = restaurant.foodItems.map((item, index) => {
        if (index === selectedFoodItem) {
          return {
            ...item,
            notes: [
              ...(item.notes || []),
              { text: newNote, userId: user.uid },
            ],
          };
        }
        return item;
      });

      await set(ref(database, `restaurants/${id}`), {
        ...restaurant,
        foodItems: updatedFoodItems,
      });

      setNewNote("");
      setSelectedFoodItem(null);
    }
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }
  console.log("res", restaurant);

  const canSeeAllNotes =
    userDetails?.userType === "admin" ||
    (userDetails?.userType === "owner" && user?.uid === restaurant.ownerId);
  console.log("user id", user?.uid);
  console.log("owner id", restaurant.ownerId);
  console.log("user type", userDetails?.userType);
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.description}</p>

      <h3>Food Items</h3>
      <ul>
        {restaurant.foodItems.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong>: {item.description}
            <ul>
              {}
              {item.notes
                .filter(
                  (note) => canSeeAllNotes || note.userId === user?.uid 
                )
                .map((note, noteIndex) => (
                  <li key={noteIndex}>{note.text}</li>
                ))}
            </ul>
            {user && (
              <button onClick={() => setSelectedFoodItem(index)}>
                Add Note to {item.name}
              </button>
            )}
          </li>
        ))}
      </ul>

      {user && selectedFoodItem !== null && (
        <form onSubmit={handleAddNote}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note"
          />
          <button type="submit">Add Note</button>
        </form>
      )}
    </div>
  );
};

export default RestaurantDetails;

