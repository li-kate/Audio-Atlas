import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

function EventsPage({ auth0Id }) {
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [showAttendees, setShowAttendees] = useState(false);

  // Fetch events, recommended events, and user's attending events
  useEffect(() => {
    // Fetch all events
    axios.get('http://localhost:5001/api/events')
      .then(response => {
        console.log("Fetched events:", response.data);
        setEvents(response.data);
      })
      .catch(error => console.error('Error fetching events:', error));

    // Fetch recommended events
    if (auth0Id) {
      axios.get(`http://localhost:5001/api/events/recommended?userId=${auth0Id}`)
        .then(response => {
          console.log("Fetched recommended events:", response.data.recommendedEvents);
          setRecommendedEvents(response.data.recommendedEvents || []);
        })
        .catch(error => {
          console.error('Error fetching recommended events:', error);
          alert('Failed to fetch recommended events. Check the console for details.');
        });
    }

    // Fetch user's attending events
    if (auth0Id) {
      axios.get(`http://localhost:5001/api/user/attending?userId=${auth0Id}`)
        .then(response => {
          console.log("Fetched attending events:", response.data.attendingEvents);
          setAttendingEvents(response.data.attendingEvents || []);
        })
        .catch(error => console.error('Error fetching attending events:', error));
    }
  }, [auth0Id]);

  // Handle seeing who's going to an event
  const handleSeeWhosGoing = (eventId) => {
    setSelectedEvent(eventId);
    axios.get(`http://localhost:5001/api/events/attendees?eventId=${eventId}&userId=${auth0Id}`)
      .then(response => {
        console.log("Fetched attendees:", response.data.attendees);
        setAttendees(response.data.attendees || []);
        setShowAttendees(true);
      })
      .catch(error => {
        console.error('Error fetching attendees:', error);
        alert('Failed to fetch attendees. Check the console for details.');
      });
  };

  const handleAttendEvent = (eventId) => {
    if (attendingEvents.includes(eventId)) {
      // User is already attending, so unattend
      axios.post('http://localhost:5001/api/events/unattend', { userId: auth0Id, eventId })
        .then(response => {
          console.log("Response:", response.data); // Log the response
          setAttendingEvents(attendingEvents.filter(id => id !== eventId)); // Update state
        })
        .catch(error => {
          console.error('Error updating event attendance:', error);
          alert('Failed to unattend the event. Check the console for details.');
        });
    } else {
      // User is not attending, so attend
      axios.post('http://localhost:5001/api/events/attend', { userId: auth0Id, eventId })
        .then(response => {
          console.log("Response:", response.data); // Log the response
          setAttendingEvents([...attendingEvents, eventId]); // Update state
        })
        .catch(error => {
          console.error('Error updating event attendance:', error);
          alert('Failed to attend the event. Check the console for details.');
        });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Upcoming Events</h1>

      {/* Recommended Events */}
      {recommendedEvents.length > 0 && (
        <div>
          <h2 style={styles.subHeader}>Recommended for You</h2>
          <div style={styles.grid}>
            {recommendedEvents.map(event => (
              <div key={event._id} style={styles.card}>
                <img src={event['pic-src']} alt={event.name} style={styles.image} />
                <div style={styles.content}>
                  <h2 style={styles.title}>{event.name}</h2>
                  <p style={styles.detail}><strong>Location:</strong> {event.location}</p>
                  <p style={styles.detail}><strong>Date:</strong> {event.date}</p>
                  <button
                    style={attendingEvents.includes(event._id) ? styles.buttonNotGoing : styles.buttonGoing}
                    onClick={() => handleAttendEvent(event._id)}
                  >
                    {attendingEvents.includes(event._id) ? "I'm Not Going" : "I'm Going"}
                  </button>
                  <button
                    style={styles.buttonSeeWhosGoing}
                    onClick={() => handleSeeWhosGoing(event._id)}
                  >
                    See Who's Going
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <h2 style={styles.subHeader}>All Events</h2>
      <div style={styles.grid}>
        {events.map(event => (
          <div key={event._id} style={styles.card}>
            <img src={event['pic-src']} alt={event.name} style={styles.image} />
            <div style={styles.content}>
              <h2 style={styles.title}>{event.name}</h2>
              <p style={styles.detail}><strong>Location:</strong> {event.location}</p>
              <p style={styles.detail}><strong>Date:</strong> {event.date}</p>
              <button
                style={attendingEvents.includes(event._id) ? styles.buttonNotGoing : styles.buttonGoing}
                onClick={() => handleAttendEvent(event._id)}
              >
                {attendingEvents.includes(event._id) ? "I'm Not Going" : "I'm Going"}
              </button>
              <button
                style={styles.buttonSeeWhosGoing}
                onClick={() => handleSeeWhosGoing(event._id)}
              >
                See Who's Going
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Attendees Modal */}
      {showAttendees && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Attendees</h2>
            <ul>
              {attendees.map((attendee, index) => (
                <li key={index}>
                  <strong>
                    <Link to={`/profile/${attendee.auth0Id}`} style={styles.profileLink}>
                        {attendee.name} 
                    </Link>
                  </strong> 
                  {/* - Top Songs: {attendee.topSongs.join(', ')} */}
                </li>
              ))}
            </ul>
            <button style={styles.buttonClose} onClick={() => setShowAttendees(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;

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
  buttonGoing: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
  buttonNotGoing: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
  buttonSeeWhosGoing: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  profileLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
  buttonClose: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
};