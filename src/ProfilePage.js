import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error loading profile. Please try again later.</div>;
  }

  if (!profile) {
    return <div style={styles.error}>No profile data found.</div>;
  }

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <h1 style={styles.header}>{profile.name || "Unknown User"}</h1>
        {profile.contactLink && profile.settings?.showContact !== false && (
          <a href={profile.contactLink} target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
            Contact Me
          </a>
        )}
      </div>

      {/* Saved Songs Section */}
      <section style={styles.section}>
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
      </section>

      {/* Attending Events Section */}
      <section style={styles.section}>
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
      </section>
    </div>
  );
};

export default ProfilePage;

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#333',
  },
  contactLink: {
    fontSize: '16px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '30px',
  },
  subHeader: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
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
    color: '#333',
  },
  detail: {
    fontSize: '14px',
    margin: '5px 0',
    color: '#555',
  },
  link: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '20px',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '20px',
    color: '#ff0000',
  },
};