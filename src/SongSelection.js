import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Song Selection</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for songs"
      />
      <button onClick={searchSongs}>Search</button>

      <h3>Search Results</h3>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <img src={song.image} alt={song.name} width="50" height="50" />
            {song.name} - {song.artist}
            <button onClick={() => handleSelectSong(song)}>Select</button>
          </li>
        ))}
      </ul>

      <h3>Selected Songs</h3>
      <ul>
        {selectedSongs.map((song, index) => (
          <li key={index}>
            <img src={song.image} alt={song.name} width="50" height="50" />
            {song.name} - {song.artist}
          </li>
        ))}
      </ul>
      <button onClick={saveSongs}>Save Songs</button>

      <h3>Saved Songs</h3>
      <ul>
        {savedSongs.map((song, index) => (
            <li key={index}>
            <img src={song.image} alt={song.name} width="50" height="50" />
            {song.name} - {song.artist}
            <button onClick={() => removeSong(song.spotify_id)}>Remove</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default SongSelection;