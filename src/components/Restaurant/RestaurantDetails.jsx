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
          notes: Array.isArray(item.notes) ? item.notes : [], 
        }));
        // Fetch images for the food items
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

  const handleAddNote = (e) => {
    e.preventDefault();
    if (user && newNote.trim() && selectedFoodItem !== null) {
      const updatedFoodItems = restaurant.foodItems.map((item, index) => {
        if (index === selectedFoodItem) {
          return {
            ...item,
            notes: [...(item.notes || []), { text: newNote, userId: user.uid }],
          };
        }
        return item;
      });

      set(ref(database, `restaurants/${id}`), {
        ...restaurant,
        foodItems: updatedFoodItems,
      })
        .then(() => {
          setNewNote("");
          setSelectedFoodItem(null);
        })
        .catch((error) => {
          console.error("Error adding note:", error);
        });
    }
  };

  const handleDeleteNote = (foodItemIndex, noteIndex) => {
    const updatedFoodItems = restaurant.foodItems.map((item, index) => {
      if (index === foodItemIndex) {
        const updatedNotes = item.notes.filter((_, i) => i !== noteIndex);
        return { ...item, notes: updatedNotes };
      }
      return item;
    });

    set(ref(database, `restaurants/${id}`), {
      ...restaurant,
      foodItems: updatedFoodItems,
    }).catch((error) => {
      console.error("Error deleting note:", error);
    });
  };

  // Fetching images for food items from API dynamically based on name available in API 
  const fetchFoodImages = (foodItems) => {
    return Promise.all(
      foodItems.map((item) => {
        return fetch(
          `https://dummyjson.com/recipes/search?q=${encodeURIComponent(
            item.name
          )}`
        )
          .then((response) => response.json())
          .then((data) => {
            const matchingRecipe = data.recipes?.[0];
            return {
              ...item,
              image: matchingRecipe ? matchingRecipe.image : "", // Use matching recipe's image
            };
          })
          .catch((error) => {
            console.error(`Error fetching image for ${item.name}:`, error);
            return item;
          });
      })
    );
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const canSeeAllNotes =
    userDetails?.userType === "admin" ||
    (userDetails?.userType === "owner" && user?.uid === restaurant.ownerId);

  return (
    <div>
      {user?.uid && <Navbar />}
      <div className="restaurant-details">
        <h2>{restaurant.name}</h2>
        <p>{restaurant.description}</p>
        <div className="food-list-container">
          <h3>Top Exotic Dishes</h3>
          <ul className="food-list">
            {restaurant.foodItems.map((item, foodItemIndex) => (
              <li className="food-card" key={foodItemIndex}>
                <div className="food-desc">
                  <img
                    src={item?.image ? item?.image : logo}
                    alt={item.name}
                    style={
                      item?.image
                        ? { width: 48, height: 48 }
                        : { width: 48, height: 24 }
                    }
                  />

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </div>
                </div>
                <div className="notes-container">
                  <div
                    className="notes-heading"
                    onClick={() =>
                      setIsNotesVisible(
                        isNotesVisible === foodItemIndex ? -1 : foodItemIndex
                      )
                    }
                  >
                    <h4>Notes</h4>
                    <span>
                      {isNotesVisible === foodItemIndex ? (
                        <img
                          src={downArrow}
                          alt="Down Arrow"
                          style={{
                            width: "24px",
                            height: "24px",
                            marginBottom: "-4px",
                            transform: "rotate(180deg)",
                          }}
                        />
                      ) : (
                        <img
                          src={downArrow}
                          alt="Down Arrow"
                          style={{
                            width: "24px",
                            height: "24px",
                            marginBottom: "-4px",
                          }}
                        />
                      )}
                    </span>
                  </div>
                  {user && (
                    <button
                      onClick={() => {
                        setSelectedFoodItem(foodItemIndex);
                        setIsNotesVisible(foodItemIndex);
                      }}
                    >
                      Add Note to {item.name}
                    </button>
                  )}
                </div>
                {user && selectedFoodItem === foodItemIndex && (
                  <form onSubmit={handleAddNote}>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note"
                    />
                    <button
                      onClick={() => {
                        setIsNotesVisible(foodItemIndex);
                      }}
                      type="submit"
                    >
                      Add Note
                    </button>
                  </form>
                )}
                <ul className="food-notes">
                  {isNotesVisible === foodItemIndex &&
                    item.notes
                      .filter(
                        (note) => canSeeAllNotes || note.userId === user?.uid
                      )
                      .map((note, noteIndex) => (
                        <li key={noteIndex}>
                          {note.text}
                          {canSeeAllNotes && (
                            <span
                              onClick={() =>
                                handleDeleteNote(foodItemIndex, noteIndex)
                              }
                              style={{
                                cursor: "pointer",
                                marginLeft: "10px",
                                fontSize: "12px",
                              }}
                            >
                              🗑️
                            </span>
                          )}
                        </li>
                      ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
