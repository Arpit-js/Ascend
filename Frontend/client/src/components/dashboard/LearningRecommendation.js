import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import styles from './LearningRecommendation.module.css';

const LearningRecommendation = ({ course }) => {
  return (
    <Card className={styles.courseCard}>
      <h3 className={styles.courseTitle}>{course.name}</h3>
      <p className={styles.courseDescription}>{course.description || "No description available."}</p>
      
      {course.matchingSkills && course.matchingSkills.length > 0 && (
        <div className={styles.skillsSection}>
          <h4 className={styles.skillsTitle}>Covers these missing skills:</h4>
          <div className={styles.skillsTags}>
            {course.matchingSkills.map(skillName => (
              <span key={skillName} className={styles.skillTag}>{skillName}</span>
            ))}
          </div>
        </div>
      )}

      <Button 
        variant="primary" 
        onClick={() => window.open(course.url, '_blank')}
        className={styles.viewCourseButton}
      >
        View Course
      </Button>
    </Card>
  );
};

export default LearningRecommendation;