import React from "react";
import styles from "./MusicDiscoveryPage.module.css";
import CallToActionButton from "./CallToActionButton";

function ContentSection() {
  return (
    <div className={styles.contentSection}>
      <div className={styles.contentColumns}>
        <div className={styles.textColumn}>
          <div className={styles.textContent}>
            <p className={styles.mainDescription}>
              Discover a world of music beyond your playlist We take your
            </p>
            <p className={styles.subDescription}>
              favorite songs, match them with hidden gems from different genres
              and cultures, and connect you to local events that bring those
              sounds to life.
            </p>
            <CallToActionButton />
          </div>
        </div>
        <div className={styles.imageColumn}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e38c77d105fde9fd4c131a9985fcea8df3f6bfc314ad45b8fda5a386c0b73fc1?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
            className={styles.featureImage}
            alt="Music discovery feature illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default ContentSection;
