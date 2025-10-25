import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import './CareerPathsPage.css';

const CareerPathsPage = () => {
  const { session } = useUser();
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [expandedRoleId, setExpandedRoleId] = useState(null);

  useEffect(() => {
    const getPageData = async () => {
      // Fetch roles with their required skills
      const { data: rolesData } = await supabase.from('roles').select('*, role_skills(skill_id)');
      if (rolesData) setRoles(rolesData);

      // Fetch all available skills
      const { data: skillsData } = await supabase.from('skills').select('*');
      if (skillsData) setSkills(skillsData);

      // Fetch the current user's skills
      if (session?.user) {
        const { data: userSkillsData } = await supabase.from('user_skills').select('skill_id').eq('user_id', session.user.id);
        if (userSkillsData) setUserSkills(userSkillsData.map(s => s.skill_id));
      }
    };
    getPageData();
  }, [session]);

  // Example career path sequence - adjust as needed
  const pathSequence = roles.map(r => r.id).slice(0, 5); // Show first 5 roles
  const careerPathRoles = pathSequence.map(roleId => roles.find(role => role.id === roleId)).filter(Boolean);

  const toggleRoleDetails = (roleId) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };

  // Updated responsibilities including App Developer
  const roleResponsibilities = {
      1: "Translate UI/UX designs into high-quality, responsive code using React. Develop and maintain reusable components. Collaborate with backend developers and designers to implement features. Write and maintain unit tests to ensure code robustness.",
      2: "Lead the design and implementation of complex frontend features using React. Architect scalable and maintainable UI systems. Mentor junior engineers and conduct code reviews. Optimize application performance and ensure cross-browser compatibility.",
      3: "Design, develop, and deploy full-stack applications. Build and manage databases (e.g., PostgreSQL). Create and consume RESTful APIs. Implement both client-side and server-side logic, ensuring seamless integration and high performance.",
      4: "Develop end-to-end web applications using MongoDB, Express.js, React, and Node.js. Build and maintain RESTful APIs. Design and manage NoSQL database schemas. Implement user interfaces and ensure seamless client-server communication.", // MERN Stack Developer
      5: "Design, build, and maintain mobile applications for iOS and/or Android platforms using native (Swift, Kotlin) or cross-platform frameworks (React Native, Flutter). Collaborate with product managers and designers to define app features. Integrate with backend APIs and ensure optimal performance and user experience." // App Developer
      // Add more IDs and responsibilities as needed
  };


  return (
    <div className="career-paths-page">
      <h1>Career Path</h1>
      <div className="timeline-container">
        {careerPathRoles.map((role, index) => {
          // Ensure role.role_skills exists before mapping
          const requiredSkillIds = role.role_skills ? role.role_skills.map(rs => rs.skill_id) : [];
          const requiredSkillObjects = requiredSkillIds.map(id => skills.find(s => s.id === id)).filter(Boolean);
          const isExpanded = expandedRoleId === role.id;

          return (
            <React.Fragment key={role.id}>
              <div className={`timeline-node ${isExpanded ? 'expanded' : ''}`}>
                <Card className="role-card" onClick={() => toggleRoleDetails(role.id)}>
                  <h3>{role.title}</h3>
                  {/* Skill dots preview */}
                  <div className="role-skills-preview">
                    {requiredSkillObjects.slice(0, 3).map(skill => {
                       const hasSkill = userSkills.includes(skill.id);
                       return <span key={skill.id} className={`skill-dot ${hasSkill ? 'have' : 'need'}`}></span>;
                    })}
                    {requiredSkillObjects.length > 3 && <span>...</span>}
                  </div>
                  {/* Expanded Details - Only Responsibilities */}
                  {isExpanded && (
                    <div className="role-details">
                      <h4 className="responsibilities-title">Responsibilities:</h4>
                      <p className="responsibilities-text">
                        {roleResponsibilities[role.id] || "Responsibilities not defined."}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
              {index < careerPathRoles.length - 1 && (
                <div className="timeline-connector"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CareerPathsPage;