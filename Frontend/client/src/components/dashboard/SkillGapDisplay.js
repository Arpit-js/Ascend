import React from 'react';
import './SkillGapDisplay.css';

const SkillGapDisplay = ({ userSkills, requiredSkills, allSkills, roleTitle }) => {
  // Find the full skill objects for the skills the user currently has
  const userSkillObjects = userSkills.map(id => allSkills.find(s => s.id === id)).filter(Boolean);

  return (
    <div className="skill-gap-analysis">
      <h2>Skill Gap Analysis</h2>
      <div className="skill-columns">
        <div className="skill-column">
          <h3>My Current Skills</h3>
          <div className="badges-container">
            {userSkillObjects.map(skill => (
              <span key={skill.id} className="skill-badge">{skill.name}</span>
            ))}
          </div>
        </div>
        <div className="skill-column">
          <h3>Required Skills for {roleTitle || '...'}</h3>
          <div className="badges-container">
            {requiredSkills.length > 0 ? (
              requiredSkills.map(skillId => {
                const skill = allSkills.find(s => s.id === skillId);
                if (!skill) return null;

                // Check if the user's skill list includes this required skill
                const hasSkill = userSkills.includes(skillId);

                return (
                  // Apply 'matched' or 'missing' class based on the check
                  <span key={skill.id} className={`skill-badge ${hasSkill ? 'matched' : 'missing'}`}>
                    {skill.name}
                  </span>
                );
              })
            ) : (
              <p className="placeholder-text">Select a target role to see required skills</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapDisplay;