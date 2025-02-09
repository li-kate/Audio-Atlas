import React from "react";
import styles from "./SavedSongs.module.css";

const SongGrid = ({ songs }) => {
  return (
    <div className={styles.songGrid}>
      {songs.map((song, index) => (
        <img
          key={index}
          loading="lazy"
          src={song.imageUrl}
          alt={`Album cover for ${song.title}`}
          className={styles.songImage}
        />
      ))}
    </div>
  );
};

export default SongGrid;
