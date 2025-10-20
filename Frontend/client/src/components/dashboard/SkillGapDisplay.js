import React from 'react';
import Card from '../common/Card';
import styles from './SkillGapDisplay.module.css';

const SkillGapDisplay = ({ matchingSkills, missingSkills }) => {
  const totalSkills = matchingSkills.length + missingSkills.length;
  const progress = totalSkills > 0 ? (matchingSkills.length / totalSkills) * 100 : 0;

  return (
    <Card className={styles.skillGapCard}>
      <h2 className={styles.title}>Your Skill Gap Analysis</h2>
      
      {totalSkills > 0 ? (
        <>
          <div className={styles.progressContainer}>
            <p>You have <strong>{matchingSkills.length}</strong> of <strong>{totalSkills}</strong> required skills.</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{Math.round(progress)}% Complete</span>
          </div>

          <div className={styles.skillLists}>
            <div className={styles.skillColumn}>
              <h3 className={styles.listTitle}>
                <span className={`${styles.icon} ${styles.missingIcon}`}>❌</span> Missing Skills ({missingSkills.length})
              </h3>
              {missingSkills.length > 0 ? (
                <ul className={styles.skillList}>
                  {missingSkills.map(skill => (
                    <li key={skill.id} className={styles.skillItem}>{skill.name}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyText}>None! You've got them all.</p>
              )}
            </div>

            <div className={styles.skillColumn}>
              <h3 className={styles.listTitle}>
                <span className={`${styles.icon} ${styles.matchingIcon}`}>✅</span> Matching Skills ({matchingSkills.length})
              </h3>
              {matchingSkills.length > 0 ? (
                <ul className={styles.skillList}>
                  {matchingSkills.map(skill => (
                    <li key={skill.id} className={styles.skillItem}>{skill.name}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyText}>None yet. Keep learning!</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className={styles.emptyText}>Select a target role to see your skill gap.</p>
      )}
    </Card>
  );
};

export default SkillGapDisplay;