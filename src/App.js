import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HowItWorks from "./components/HowItWorks/HowItWorks.jsx";
import MusicDiscoveryPage from "./components/MusicDiscovery/MusicDiscoveryPage.jsx"; // Ensure this file exists

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const location = useLocation(); // Get the current route location

  // Save user to the backend when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      axios
        .post("http://localhost:5000/api/users", {
          auth0Id: user.sub,
          email: user.email,
          name: user.name,
        })
        .then((response) => console.log("User saved:", response.data))
        .catch((error) => console.error("Error saving user:", error));
    }
  }, [isAuthenticated, user]);

  return (
    <div>
      {/* Navigation and Auth Buttons */}
      <header>
        {/* Show Log In button only on the How It Works page */}
        {!isAuthenticated && location.pathname === "/how-it-works" && (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        )}

        {/* Show Log Out button and navigation links when authenticated */}
        {isAuthenticated && (
          <div>
            <p>Hello, {user.name}!</p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
            <nav>
              <Link to="/">Music Discovery</Link>
              <Link to="/how-it-works">How It Works</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Routes */}
      <Routes>
        {/* Music Discovery is the homepage (default route) */}
        <Route path="/" element={<MusicDiscoveryPage />} />

        {/* How It Works page */}
        <Route
          path="/how-it-works"
          element={<HowItWorks loginWithRedirect={loginWithRedirect} />}
        />
        {/* Song Selection page */}
        <Route path="/song-selection" element={<SongSelection />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
