import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0
import styles from "./HowItWorks.module.css";
import PointCard from "./PointCard";

const HowItWorks = ({ loginWithRedirect }) => {
  const { isAuthenticated } = useAuth0(); // Check if the user is authenticated
  const navigate = useNavigate(); // Initialize the navigate function

  // Redirect to the Song Selection page after login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/song-selection"); // Redirect to the Song Selection page
    }
  }, [isAuthenticated, navigate]);

  const points = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f75237c540afa9ff59b99f7a01a9d389f0c847990e7e61d64727fc563c958ab9?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      title: "Point 1",
      description:
        "Big picture cc me on that and low engagement quarterly sales are at an all-time low. Throughput let's see if we can dovetail these two projects and throughput please advise soonest so highlights nor product market fit. at the end of the",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/059577ea53726da795b71dd6a123da5a1e4f19c9466b24235b89f4fc9376c673?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      title: "Point 2",
      description:
        "Big picture cc me on that and low engagement quarterly sales are at an all-time low. Throughput let's see if we can dovetail these two projects and throughput please advise soonest so highlights nor product market fit. at the end of the",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/73878b013464b541c84ff74789b27096112864d7e3a73d5004122aab2a1640ce?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569",
      title: "Point 3",
      description:
        "Big picture cc me on that and low engagement quarterly sales are at an all-time low. Throughput let's see if we can dovetail these two projects and throughput please advise soonest so highlights nor product market fit. at the end of the",
    },
  ];

  return (
    <div className={styles.howItWorksFrame}>
      <div className={styles.howItWorks}>
        <div className={styles.clipPathGroup}>
          <div className={styles.vector}>
            <div className={styles.container}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc97b50123b98b24176939f42d160e0d655c05a60ce18d44aca523e8592ea99f?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
                alt="Background"
                className={styles.backgroundImage}
              />
              <header className={styles.header}>
                <div>01</div>
                <div>Audio Atlas</div>
                {/* Show Log In button only if the user is not authenticated */}
                {!isAuthenticated && (
                  <div onClick={() => loginWithRedirect()}>Log In</div>
                )}
              </header>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec755fc232ad3f2d8a489f6f53b4171a85c0bb10444a437dfd124a4b53c5ef23?placeholderIfAbsent=true&apiKey=023f6e46cf9848ceae3cfcfe04f63569"
                alt=""
                className={styles.divider}
              />
              <h1 className={styles.title}>Here's how it works!</h1>
              <div className={styles.pointsContainer}>
                <div className={styles.pointsWrapper}>
                  {points.map((point, index) => (
                    <div key={index} className={styles.column}>
                      <PointCard {...point} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
