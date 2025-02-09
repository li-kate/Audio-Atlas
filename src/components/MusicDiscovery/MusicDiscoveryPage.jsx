import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./MusicDiscoveryPage.module.css";
import NavigationMenu from "./NavigationMenu";
import ContentSection from "./ContentSection";

function MusicDiscoveryPage() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the "How It Works" click
  const handleHowItWorksClick = () => {
    navigate("/how-it-works"); // Navigate to the How It Works page
  };

  return (
    <div className={styles.landingPageFrame}>
      <div className={styles.landingPage}>
        <div className={styles.clipPathGroup}>
          <div className={styles.mainContent}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3affd39604a5493a06012abc4e8cd272c7a9b3edf38bca40d89c9de29f730341?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
              className={styles.backgroundImage}
              alt="Background"
            />
            {/* Pass handleHowItWorksClick to NavigationMenu */}
            <NavigationMenu onHowItWorksClick={handleHowItWorksClick} />
            <ContentSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicDiscoveryPage;
