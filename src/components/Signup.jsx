import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import './AuthStyles.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');
  const [foodItems, setFoodItems] = useState('');
  const [error, setError] = useState('');
  const [activePanel, setActivePanel] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: displayName });

      // If it's an owner, save restaurant details to the database
      if (activePanel === 'owner') {
        const foodItemsArray = foodItems.split(',').map(item => {
          const [name, description] = item.split(':');
          return { name: name.trim(), description: description.trim() };
        });

        await set(ref(database, 'restaurants/' + user.uid), {
          name: restaurantName,
          description: restaurantDescription,
          foodItems: foodItemsArray,
          ownerId: user.uid
        });
      }

      // Save user type to the database
      await set(ref(database, 'users/' + user.uid), {
        email: user.email,
        displayName: displayName,
        userType: activePanel
      });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const renderSignupForm = (userType) => (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{userType} Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      {userType === 'Owner' && (
        <>
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
          <textarea
            placeholder="Restaurant Description"
            value={restaurantDescription}
            onChange={(e) => setRestaurantDescription(e.target.value)}
            required
          />
          <textarea
            placeholder="Food Items (format: name: description, name: description)"
            value={foodItems}
            onChange={(e) => setFoodItems(e.target.value)}
            required
          />
        </>
      )}
      <button type="submit">Sign Up</button>
    </form>
  );

  return (
    <div className="auth-page">
      <div className="toggle-buttons">
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
        <div className={`panel ${activePanel === 'owner' ? 'active' : ''}`}>
          {renderSignupForm('Owner')}
        </div>
        <div className={`panel ${activePanel === 'user' ? 'active' : ''}`}>
          {renderSignupForm('User')}
        </div>
      </div>
      <div className="auth-toggle">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;