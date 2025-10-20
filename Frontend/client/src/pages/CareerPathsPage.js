import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from './CareerPathsPage.module.css';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

const CareerPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareerPaths = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all distinct paths (assuming a 'path_name' column in 'roles')
        const { data: pathNames, error: pathError } = await supabase
          .from('roles')
          .select('path_name')
        
        if (pathError) throw pathError;

        // Get unique path names
        const uniquePathNames = [...new Set(pathNames.map(p => p.path_name))];

        // 2. For each path, fetch the roles and their skills
        const pathsData = await Promise.all(
          uniquePathNames.map(async (pathName) => {
            const { data: roles, error: rolesError } = await supabase
              .from('roles')
              .select(`
                id,
                name,
                role_skills (
                  skills (id, name)
                )
              `)
              .eq('path_name', pathName)
              .order('name', { ascending: true }); // Simple ordering

            if (rolesError) throw rolesError;

            return { name: pathName, roles };
          })
        );

        setPaths(pathsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerPaths();
  }, []);

  if (loading) {
    return <div className={styles.centerContainer}><Spinner size="large" /></div>;
  }

  if (error) {
    return <div className={styles.centerContainer}><p className={styles.errorText}>{error}</p></div>;
  }

  return (
    <div className={styles.pathsPage}>
      <h1 className={styles.pageTitle}>Career Paths</h1>
      {paths.map(path => (
        <div key={path.name} className={styles.pathSection}>
          <h2 className={styles.pathName}>{path.name}</h2>
          <div className={styles.pathContainer}>
            {path.roles.map((role, index) => {
              const skills = role.role_skills.map(rs => rs.skills).filter(Boolean);
              return (
                <React.Fragment key={role.id}>
                  <Card className={styles.roleCard}>
                    <span className={styles.roleStep}>Step {index + 1}</span>
                    <h3 className={styles.roleName}>{role.name}</h3>
                    <h4 className={styles.skillsTitle}>Required Skills:</h4>
                    {skills.length > 0 ? (
                      <ul className={styles.skillList}>
                        {skills.map(skill => (
                          <li key={skill.id} className={styles.skillItem}>{skill.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.noSkills}>Skills not defined for this role.</p>
                    )}
                  </Card>
                  {index < path.roles.length - 1 && (
                    <div className={styles.pathConnector}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CareerPathsPage;