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
  const { user } = useContext(AuthContext); // Assuming userDetails include userType

  useEffect(() => {
    const restaurantRef = ref(database, `restaurants/${id}`);
    const restaurantUnsubscribe = onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Ensure each foodItem has a notes array of objects with text and userId
        const foodItems = data.foodItems.map((item) => ({
          ...item,
          notes: Array.isArray(item.notes) ? item.notes : [], // Ensure notes is an array of objects
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
      // Add note object to the selected food item's notes array
      const updatedFoodItems = restaurant.foodItems.map((item, index) => {
        if (index === selectedFoodItem) {
          return {
            ...item,
            notes: [
              ...(item.notes || []),
              { text: newNote, userId: user.uid }, // Add note as an object with text and userId
            ],
          };
        }
        return item;
      });

      // Update restaurant data with new notes in the database
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

  // Determine if the user can see all notes
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
              {/* Filter notes based on user type and ownership */}
              {item.notes
                .filter(
                  (note) => canSeeAllNotes || note.userId === user?.uid // Show all notes for admins/owners, or only user's notes
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

// import React, { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { database } from "../../firebase/firebase";
// import { ref, onValue, set } from "firebase/database";
// import { AuthContext } from "../../contexts/AuthContext";

// const RestaurantDetails = () => {
//   const { id } = useParams();
//   const [restaurant, setRestaurant] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [selectedFoodItem, setSelectedFoodItem] = useState(null);
//   const { user, userDetails } = useContext(AuthContext); // Assuming userDetails include userType and owner identification

//   useEffect(() => {
//     const restaurantRef = ref(database, `restaurants/${id}`);
//     const restaurantUnsubscribe = onValue(restaurantRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         // Ensure each foodItem has a notes array of objects with text and userId
//         const foodItems = data.foodItems.map((item) => ({
//           ...item,
//           notes: Array.isArray(item.notes) ? item.notes : [], // Ensure notes is an array of objects
//         }));
//         setRestaurant({ id, ...data, foodItems });
//       }
//     });

//     return () => {
//       restaurantUnsubscribe();
//     };
//   }, [id]);

//   const handleAddNote = async (e) => {
//     e.preventDefault();
//     if (user && newNote.trim() && selectedFoodItem !== null) {
//       // Add note object to the selected food item's notes array
//       const updatedFoodItems = restaurant.foodItems.map((item, index) => {
//         if (index === selectedFoodItem) {
//           return {
//             ...item,
//             notes: [
//               ...(item.notes || []),
//               { text: newNote, userId: user.uid }, // Add note as an object with text and userId
//             ],
//           };
//         }
//         return item;
//       });

//       // Update restaurant data with new notes in the database
//       await set(ref(database, `restaurants/${id}`), {
//         ...restaurant,
//         foodItems: updatedFoodItems,
//       });

//       setNewNote("");
//       setSelectedFoodItem(null);
//     }
//   };

//   if (!restaurant) {
//     return <div>Loading...</div>;
//   }

//   // Determine if the user can see all notes based on their role and restaurant ownership
//   const canSeeAllNotes =
//     userDetails?.userType === "admin" ||
//     (userDetails?.userType === "owner" &&
//       userDetails.ownerId === restaurant.ownerId); // Matching ownerId with stored ownerId in restaurant

//   return (
//     <div>
//       <h2>{restaurant.name}</h2>
//       <p>{restaurant.description}</p>

//       <h3>Food Items</h3>
//       <ul>
//         {restaurant.foodItems.map((item, index) => (
//           <li key={index}>
//             <strong>{item.name}</strong>: {item.description}
//             <ul>
//               {/* Filter notes based on user type, ownership, or individual user */}
//               {item.notes
//                 .filter(
//                   (note) => canSeeAllNotes || note.userId === user?.uid // Show all notes for admins/owners, or only user's notes
//                 )
//                 .map((note, noteIndex) => (
//                   <li key={noteIndex}>{note.text}</li>
//                 ))}
//             </ul>
//             {user && (
//               <button onClick={() => setSelectedFoodItem(index)}>
//                 Add Note to {item.name}
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>

//       {user && selectedFoodItem !== null && (
//         <form onSubmit={handleAddNote}>
//           <input
//             type="text"
//             value={newNote}
//             onChange={(e) => setNewNote(e.target.value)}
//             placeholder="Add a note"
//           />
//           <button type="submit">Add Note</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default RestaurantDetails;
