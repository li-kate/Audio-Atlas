import React from "react";
import styles from "./SelectedSongs.module.css";

const AlbumCover = ({ src, alt }) => {
  return (
    <img loading="lazy" src={src} alt={alt} className={styles.albumCover} />
  );
};

export default AlbumCover;
