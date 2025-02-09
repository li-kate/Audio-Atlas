import React from "react";
import PropTypes from "prop-types";
import styles from "./PointCard.module.css";

const PointCard = ({ icon, title, description }) => {
  return (
    <div className={styles.pointContent}>
      <img loading="lazy" src={icon} alt="" className={styles.pointIcon} />
      <div className={styles.pointTitle}>{title}</div>
      <div className={styles.pointDescription}>{description}</div>
    </div>
  );
};

PointCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default PointCard;
