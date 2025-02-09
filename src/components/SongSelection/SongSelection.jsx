import React from "react";
import styles from "./SongSelection.module.css";

function SongSelection() {
  return (
    <div className={styles.songSelectionContainer}>
      <div className={styles.songSelectionWrapper}>
        <section className={styles.heroSection}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/72f5b88267bff96b8c41cdd211bbb788555f5a628d167c7ddbba31b5b773bf80?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
            className={styles.backgroundImage}
            alt=""
          />
          <div className={styles.contentWrapper}>
            <div className={styles.textContent}>
              <h1 className={styles.mainTitle}>Song Selection</h1>
              <p className={styles.subtitle}>
                Tell us some songs that you already like!
              </p>
            </div>
            <form className={styles.inputContainer}>
              <div className={styles.locationInput}>
                <label
                  htmlFor="locationInput"
                  className={styles["visually-hidden"]}
                >
                  Location
                </label>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c20ee2feea6c48685d6f6c294dc3536366c8d672aba77f0ca2d86c4c8e3ffc8?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
                  alt=""
                />
                <input
                  type="text"
                  id="locationInput"
                  placeholder="Location"
                  aria-label="Location"
                />
              </div>
              <button type="submit" className={styles.searchButton}>
                <div className={styles.searchButtonInner}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/87ce7d10319b056ac65a060393f256e462c37654a59b41028cb29106d27a993b?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
                    alt=""
                  />
                  Search
                </div>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SongSelection;
