import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SongSelection from './SongSelection';

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
      <div>
        <h1>Welcome to Tinder Clone</h1>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
          <div>
            <p>Hello, {user.name}!</p>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log Out
            </button>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/songs">Song Selection</Link>
            </nav>
          </div>
        )}
        <Routes>
          <Route path="/songs" element={<SongSelection auth0Id={user?.sub} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;