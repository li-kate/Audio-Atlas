import React from "react";
import styles from "./SearchResults.module.css";
import SongImage from "./SongImage";

const SearchResults = () => {
  const songImages = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7b899feea292daea53878423e04e6a7080a7bd59bff8f3a4d42eaad8a32b8f81?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Song album cover",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b7c1354aa79125ad9bb6736c07c2bbaf075a9c97297602b4746e7ec1de42a4b7?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Song album cover",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/48bfb56a143d5210b76124fde0c809b846e6852ba8297b0d8f82f80c417aae88?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Song album cover",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/c63c0e7bc911ff4b3e8f9c1859d6070c3621d167289c1664d1030a208cf2a132?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Song album cover",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/01cbc4822f60118bc7ad052d722c96a664b0ef86fd456fa53c258cfab5273d00?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Song album cover",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.searchResultsWrapper}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a0ffe2446cd03cec3e031cc2ae5e4e0d5663ccff02cfdc0272ba7b1a912ffff6?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
          alt=""
          className={styles.backgroundImage}
        />
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>Search Results</h1>
          <p className={styles.subtitle}>Click on the song you want!</p>
          <div className={styles.imageGrid}>
            {songImages.map((song, index) => (
              <SongImage key={index} src={song.src} alt={song.alt} />
            ))}
          </div>
          <div className={styles.imageGrid}>
            {songImages.map((song, index) => (
              <SongImage key={index + 5} src={song.src} alt={song.alt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
