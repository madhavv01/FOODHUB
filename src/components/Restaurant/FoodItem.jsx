import React, { useState, useContext, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AuthContext } from '../../contexts/AuthContext';

const FoodItem = ({ foodItem, restaurantId }) => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotes = async () => {
      if (user) {
        const notesCollection = collection(db, 'notes');
        const q = query(
          notesCollection,
          where('foodItemId', '==', foodItem.id),
          where('userId', '==', user.uid)
        );
        const notesSnapshot = await getDocs(q);
        const notesList = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotes(notesList);
      }
    };

    fetchNotes();
  }, [foodItem.id, user]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (user && note.trim()) {
      const newNote = {
        userId: user.uid,
        foodItemId: foodItem.id,
        restaurantId: restaurantId,
        content: note,
        createdAt: new Date()
      };
      await addDoc(collection(db, 'notes'), newNote);
      setNotes([...notes, newNote]);
      setNote('');
    }
  };

  return (
    <div>
      <h4>{foodItem.name}</h4>
      <p>{foodItem.description}</p>
      <p>Price: ${foodItem.price}</p>
      {user && (
        <div>
          <h5>Your Notes:</h5>
          <ul>
            {notes.map(note => (
              <li key={note.id}>{note.content}</li>
            ))}
          </ul>
          <form onSubmit={handleAddNote}>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
            />
            <button type="submit">Add Note</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FoodItem;