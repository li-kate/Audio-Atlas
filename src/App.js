import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SongSelection from './SongSelection';
import EventsPage from './EventsPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import './App.css'; // Import the CSS file

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      axios.post('http://localhost:5000/api/users', {
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
      })
      .then(response => console.log('User saved:', response.data))
      .catch(error => console.error('Error saving user:', error));
    }
  }, [isAuthenticated, user]);

  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <h1>Welcome to Audio Atlas!</h1>
        </div>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
          <div>
            <p className="user-greeting">Hello, {user.name}!</p>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log Out
            </button>
            <nav className="app-nav">
              <Link to="/">Home</Link>
              <Link to="/songs">Song Selection</Link>
              <Link to="/events">Events</Link>
              <Link to="http://localhost:8501/">Generate Playlist</Link>
              <Link to={`/profile/${user?.sub}`}>Public Profile</Link>
              <Link to="/settings">Settings</Link>
            </nav>
          </div>
        )}
        <div className="app-content">
          <Routes>
            <Route path="/songs" element={<SongSelection auth0Id={user?.sub} />} />
            <Route path="/events" element={<EventsPage auth0Id={user?.sub} />} />
            <Route path="/profile/:auth0Id" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage auth0Id={user?.sub} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;