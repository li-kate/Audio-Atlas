import React from "react";
import styles from "./SearchResults.module.css";

const SongImage = ({ src, alt }) => {
  return (
    <img loading="lazy" src={src} alt={alt} className={styles.songImage} />
  );
};

export default SongImage;
