import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Card from '../components/common/Card';
import './CareerPathsPage.css';

const CareerPathsPage = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      const { data } = await supabase.from('roles').select('*');
      if(data) setRoles(data);
    };
    getRoles();
  }, []);
  
  // Example: Use the first 3 roles as the career path
  const careerPathRoles = roles.slice(0, 3);

  return (
    <div className="career-paths-page">
      <h1>Frontend Career Path</h1>
      <div className="timeline">
        {careerPathRoles.map((role, index) => (
          // This is the JSX that was missing
          <React.Fragment key={role.id}>
            <div className="timeline-item">
              <Card>
                <h3>{role.title}</h3>
              </Card>
            </div>
            {index < careerPathRoles.length - 1 && (
              <div className="timeline-connector"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CareerPathsPage;