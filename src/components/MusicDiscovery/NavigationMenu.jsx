import React from "react";
import styles from "./MusicDiscoveryPage.module.css";

function NavigationMenu() {
  const menuItems = [
    { text: "How It Works", className: styles.services },
    { text: "Song Selection", className: styles.aboutUs },
    { text: "Generate Playlists", className: styles.articles },
    { text: "Find Events", className: styles.healthcareProfessionals },
  ];

  return (
    <nav className={styles.navigationMenu}>
      {menuItems.map((item, index) => (
        <button key={index} className={item.className}>
          {item.text}
        </button>
      ))}
    </nav>
  );
}

export default NavigationMenu;
