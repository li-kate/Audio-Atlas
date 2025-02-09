import React from "react";
import styles from "./SelectedSongs.module.css";
import AlbumCover from "./AlbumCover";

const SelectedSongs = () => {
  const albumCovers = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7b899feea292daea53878423e04e6a7080a7bd59bff8f3a4d42eaad8a32b8f81?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Album cover 1",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b47e1bc8f3a4415bbc43e753abad7a60881926ae3708c00b095a53ac089d44f0?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Album cover 2",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/48bfb56a143d5210b76124fde0c809b846e6852ba8297b0d8f82f80c417aae88?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Album cover 3",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/c63c0e7bc911ff4b3e8f9c1859d6070c3621d167289c1664d1030a208cf2a132?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Album cover 4",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/01cbc4822f60118bc7ad052d722c96a664b0ef86fd456fa53c258cfab5273d00?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      alt: "Album cover 5",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a0ffe2446cd03cec3e031cc2ae5e4e0d5663ccff02cfdc0272ba7b1a912ffff6?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
          alt=""
          className={styles.backgroundImage}
        />
        <div className={styles.content}>
          <h1 className={styles.title}>Selected Songs</h1>
          <p className={styles.subtitle}>
            Double check you want to save all these songs!
          </p>
          <div className={styles.imageGrid}>
            {albumCovers.map((album, index) => (
              <AlbumCover key={index} src={album.src} alt={album.alt} />
            ))}
          </div>
          <div className={styles.imageGrid}>
            {albumCovers.map((album, index) => (
              <AlbumCover key={index + 5} src={album.src} alt={album.alt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedSongs;
