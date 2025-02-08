import React, { useState } from 'react';
import axios from 'axios';

function SongSelection({ auth0Id }) {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const searchSongs = async () => {
    const response = await axios.get(`http://localhost:5001/api/songs?query=${query}`);
    setSongs(response.data);
  };

  const handleSelectSong = (song) => {
    setSelectedSongs([...selectedSongs, song]);
  };

  const saveSongs = async () => {
    await axios.post('http://localhost:5001/api/user/songs', { auth0Id, songs: selectedSongs });
    alert('Songs saved!');
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
    </div>
  );
}

export default SongSelection;