import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [activePanel, setActivePanel] = useState('user');

  const renderLoginForm = (userType) => (
    <form className="login-form">
      <h2>{userType} Login</h2>
      <input type="text" placeholder="Username" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );

  return (
    <div className="login-page">
      <div className="toggle-buttons">
        <button 
          className={activePanel === 'admin' ? 'active' : ''}
          onClick={() => setActivePanel('admin')}
        >
          Admin
        </button>
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
        <div className={`panel ${activePanel === 'admin' ? 'active' : ''}`}>
          {renderLoginForm('Admin')}
        </div>
        <div className={`panel ${activePanel === 'owner' ? 'active' : ''}`}>
          {renderLoginForm('Owner')}
        </div>
        <div className={`panel ${activePanel === 'user' ? 'active' : ''}`}>
          {renderLoginForm('User')}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;