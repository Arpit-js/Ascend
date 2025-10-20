import React from 'react';
import Card from '../common/Card';
import styles from './AiRecommendation.module.css';

const AiRecommendation = ({ recommendation }) => {
  const { title, description, type } = recommendation;

  return (
    <Card className={styles.aiCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.typeBadge}>{type}</span>
      </div>
      <p className={styles.description}>{description}</p>
    </Card>
  );
};

export default AiRecommendation;