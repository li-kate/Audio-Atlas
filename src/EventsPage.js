import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventsPage({ auth0Id }) {
  const [events, setEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);

  // Fetch events and user's attending events
  useEffect(() => {
    // Fetch all events
    axios.get('http://localhost:5001/api/events')
      .then(response => {
        console.log("Fetched events:", response.data); // Log the fetched data
        setEvents(response.data);
      })
      .catch(error => console.error('Error fetching events:', error));

    // Fetch user's attending events
    if (auth0Id) {
      axios.get(`http://localhost:5001/api/user/attending?userId=${auth0Id}`)
        .then(response => {
          console.log("Fetched attending events:", response.data); // Log the fetched data
          setAttendingEvents(response.data.attendingEvents || []);
        })
        .catch(error => console.error('Error fetching attending events:', error));
    }
  }, [auth0Id]);

  // Handle attending/unattending an event
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
            </div>
          </div>
        ))}
      </div>
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
};