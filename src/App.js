import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SongSelection from './SongSelection';
import EventsPage from './EventsPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import './App.css'; // Import the CSS file
import globeImage from './globe.png'; // Import the globe image

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
          <img src={globeImage} alt="Globe" className="globe-image" />
          <p>
          <h1>Welcome </h1>
          <h1>to</h1>
          <h1>Audio Atlas!</h1>
          </p>
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
            <Route path="/" element={
              <div className="home-description">
                <h2>Step 1</h2>
                <p>First, search for and select your current favorite songs. We'll use these to find new music and nearby events that you'll love. Find community by getting involved in local events. You can also save songs you like to your profile for later listening.</p>
                <h2>Step 2</h2>
                <p>See who is also going to an event you're interested in and connect! Meet someone new and get perhaps introduced to a new genre or culture, the sky's the limit on possibilities. You can also see what songs they like and save them to your profile.</p>
                <h2>Step 3</h2>
                <p>User privacy is of our utmost importance, and thus we do not share your personal information with anyone without your consent. Head to the Settings page to manage your privacy settings and preferences.</p>
              </div>
            } />
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