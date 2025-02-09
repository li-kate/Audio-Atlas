import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to access route parameters

const ProfilePage = () => {
  const { auth0Id } = useParams(); // Get auth0Id from the URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendingEventDetails, setAttendingEventDetails] = useState([]);

  // Fetch profile data
  useEffect(() => {
    console.log(`Fetching profile for auth0Id: ${auth0Id}`); // Debug log
    if (auth0Id) {
      axios.get(`http://localhost:5001/api/user/profile?auth0Id=${auth0Id}`)
        .then(response => {
          console.log("Profile data:", response.data); // Debug log
          setProfile(response.data);
          setLoading(false);

          // Fetch details for attending events
          if (response.data.attendingEvents && response.data.attendingEvents.length > 0) {
            axios.post('http://localhost:5001/api/events/details', { eventIds: response.data.attendingEvents })
              .then(eventResponse => {
                console.log("Attending event details:", eventResponse.data); // Debug log
                setAttendingEventDetails(eventResponse.data);
              })
              .catch(error => {
                console.error('Error fetching attending event details:', error);
              });
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [auth0Id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{profile.name || "Unknown User"}</h1>

      {/* Saved Songs Section */}
      <h2 style={styles.subHeader}>Saved Songs</h2>
      <div style={styles.grid}>
        {profile.savedSongs && profile.savedSongs.map((song, index) => (
          <div key={index} style={styles.card}>
            <img src={song.image} alt={song.name} style={styles.image} />
            <div style={styles.content}>
              <h2 style={styles.title}>{song.name}</h2>
              <p style={styles.detail}><strong>Artist:</strong> {song.artist}</p>
              <p style={styles.detail}><strong>Album:</strong> {song.album}</p>
              <a href={`https://open.spotify.com/track/${song.spotify_id}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
                Listen on Spotify
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Attending Events Section */}
      <h2 style={styles.subHeader}>Attending Events</h2>
      <div style={styles.grid}>
        {attendingEventDetails.map(event => (
          <div key={event._id} style={styles.card}>
            <img src={event['pic-src']} alt={event.name} style={styles.image} />
            <div style={styles.content}>
              <h2 style={styles.title}>{event.name}</h2>
              <p style={styles.detail}><strong>Location:</strong> {event.location}</p>
              <p style={styles.detail}><strong>Date:</strong> {event.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social Link Section */}
      {profile.contactLink && profile.settings?.showContact !== false && (
        <div style={styles.contactLink}>
          <a href={profile.contactLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
            Contact Me
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  subHeader: {
    marginBottom: '10px',
    fontSize: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    padding: '0 20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  content: {
    padding: '15px',
  },
  title: {
    fontSize: '18px',
    margin: '0 0 10px',
  },
  detail: {
    fontSize: '14px',
    margin: '5px 0',
  },
  link: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#007bff',
    textDecoration: 'none',
  },
  contactLink: {
    marginTop: '20px',
    textAlign: 'center',
  },
};