import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./MusicDiscoveryPage.module.css"; // Adjust the import based on your CSS module

function CallToActionButton() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the button click
  const handleClick = () => {
    navigate("/how-it-works"); // Navigate to the How It Works page
  };

  return (
    <div className={styles.ctaWrapper}>
      <button className={styles.ctaButton} onClick={handleClick}>
        Start Here
      </button>
    </div>
  );
}

export default CallToActionButton;
