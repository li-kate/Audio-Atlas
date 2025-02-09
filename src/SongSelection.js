import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SongSelection.css'; // Import the CSS file

function SongSelection({ auth0Id }) {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);

  // Fetch saved songs when the component loads
  useEffect(() => {
    if (auth0Id) {
      axios.get(`http://localhost:5001/api/user/songs?auth0Id=${auth0Id}`)
        .then(response => setSavedSongs(response.data))
        .catch(error => console.error('Error fetching saved songs:', error));
    }
  }, [auth0Id]);

  const searchSongs = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/songs?query=${query}`);
      setSongs(response.data);
    } catch (error) {
      console.error('Error searching songs:', error);
      alert('Failed to search songs. Check the console for details.');
    }
  };

  const handleSelectSong = (song) => {
    setSelectedSongs([...selectedSongs, song]);
  };

  const saveSongs = async () => {
    try {
      await axios.post('http://localhost:5001/api/user/songs', { auth0Id, songs: selectedSongs });
      alert('Songs saved!');
      // Refresh the saved songs list after saving
      const response = await axios.get(`http://localhost:5001/api/user/songs?auth0Id=${auth0Id}`);
      setSavedSongs(response.data);
      setSelectedSongs([]); // Clear selected songs after saving
    } catch (error) {
      console.error('Error saving songs:', error);
      alert('Failed to save songs. Check the console for details.');
    }
  };

  const removeSong = async (songId) => {
    try {
      await axios.post('http://localhost:5001/api/user/songs/remove', { auth0Id, songId });
      // Refresh the saved songs list after removing
      const response = await axios.get(`http://localhost:5001/api/user/songs?auth0Id=${auth0Id}`);
      setSavedSongs(response.data);
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Failed to remove song. Check the console for details.');
    }
  };

  return (
    <div className="song-selection-container">
      <h2 className="header">Song Selection</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs"
          className="search-input"
        />
        <button onClick={searchSongs} className="search-button">Search</button>
      </div>

      {/* Search Results */}
      <h3 className="sub-header">Search Results</h3>
      <div className="song-grid">
        {songs.map((song, index) => (
          <div key={index} className="song-card">
            <img src={song.image} alt={song.name} className="song-image" />
            <div className="song-details">
              <h4 className="song-title">{song.name}</h4>
              <p className="song-artist">{song.artist}</p>
              <button onClick={() => handleSelectSong(song)} className="select-button">
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Songs */}
      <h3 className="sub-header">Selected Songs</h3>
      <div className="song-grid">
        {selectedSongs.map((song, index) => (
          <div key={index} className="song-card">
            <img src={song.image} alt={song.name} className="song-image" />
            <div className="song-details">
              <h4 className="song-title">{song.name}</h4>
              <p className="song-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedSongs.length > 0 && (
        <button onClick={saveSongs} className="save-button">Save Selected Songs</button>
      )}

      {/* Saved Songs */}
      <h3 className="sub-header">Saved Songs</h3>
      <div className="song-grid">
        {savedSongs.map((song, index) => (
          <div key={index} className="song-card">
            <img src={song.image} alt={song.name} className="song-image" />
            <div className="song-details">
              <h4 className="song-title">{song.name}</h4>
              <p className="song-artist">{song.artist}</p>
              <button onClick={() => removeSong(song.spotify_id)} className="remove-button">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SongSelection;