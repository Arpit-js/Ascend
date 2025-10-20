import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import styles from './DashboardPage.module.css';

import Card from '../components/common/Card';
import CustomDropdown from '../components/common/CustomDropdown';
import Spinner from '../components/common/Spinner';
import SkillGapDisplay from '../components/dashboard/SkillGapDisplay';
import AiRecommendation from '../components/dashboard/AiRecommendation';

const DashboardPage = () => {
  const { user } = useUser();
  const [roles, setRoles] = useState([]);
  const [allSkills, setAllSkills] = useState(new Map());
  const [userSkills, setUserSkills] = useState(new Set()); // Bug Fix: Initialize userSkills state
  
  const [targetRoleId, setTargetRoleId] = useState(null);
  const [targetRoleSkills, setTargetRoleSkills] = useState(new Set());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiRecs, setAiRecs] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Fetch all static and user-specific data on load
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      try {
        const [roleRes, skillRes, userSkillRes] = await Promise.all([
          supabase.from('roles').select('id, name'),
          supabase.from('skills').select('id, name'),
          supabase.from('user_skills').select('skill_id').eq('user_id', user.id)
        ]);

        if (roleRes.error) throw new Error(`Roles Error: ${roleRes.error.message}`);
        if (skillRes.error) throw new Error(`Skills Error: ${skillRes.error.message}`);
        if (userSkillRes.error) throw new Error(`User Skills Error: ${userSkillRes.error.message}`);

        setRoles(roleRes.data);
        setAllSkills(new Map(skillRes.data.map(s => [s.id, s.name])));
        setUserSkills(new Set(userSkillRes.data.map(s => s.skill_id)));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Fetch skills for the selected target role
  useEffect(() => {
    const fetchRoleSkills = async () => {
      if (!targetRoleId) {
        setTargetRoleSkills(new Set());
        setAiRecs([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('role_skills')
          .select('skill_id')
          .eq('role_id', targetRoleId);
        
        if (error) throw error;
        setTargetRoleSkills(new Set(data.map(s => s.skill_id)));
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchRoleSkills();
  }, [targetRoleId]);

  // Memoized calculation for skill gap
  const skillGap = useMemo(() => {
    const required = Array.from(targetRoleSkills);
    const missing = [];
    const matching = [];

    required.forEach(skillId => {
      if (userSkills.has(skillId)) {
        matching.push({ id: skillId, name: allSkills.get(skillId) });
      } else {
        missing.push({ id: skillId, name: allSkills.get(skillId) });
      }
    });
    return { missing, matching };
  }, [userSkills, targetRoleSkills, allSkills]);

  // Get AI-powered recommendations when skill gap changes
  useEffect(() => {
    const getAiRecommendations = async () => {
      if (skillGap.missing.length === 0) {
        setAiRecs([]);
        return;
      }

      setLoadingRecs(true);
      setError(null);
      const missingSkillNames = skillGap.missing.map(s => s.name);

      try {
        const { data, error } = await supabase.functions.invoke(
          'get-learning-recommendations',
          { body: { missingSkills: missingSkillNames } }
        );

        if (error) throw error;
        setAiRecs(data);
      } catch (err) {
        setError("Could not fetch AI recommendations. Please try again later.");
        console.error("Error invoking Edge Function:", err.message);
      } finally {
        setLoadingRecs(false);
      }
    };

    if (targetRoleId) {
      getAiRecommendations();
    }
  }, [skillGap, targetRoleId]);


  if (loading) {
    return <div className={styles.centerContainer}><Spinner size="large" /></div>;
  }

  return (
    <div className={styles.dashboardPage}>
      <Card className={styles.roleSelectorCard}>
        <h2 className={styles.sectionTitle}>Select Your Target Role</h2>
        <p className={styles.sectionSubtitle}>Choose a role to see your skill gap and learning recommendations.</p>
        <CustomDropdown
          options={roles}
          selectedValue={targetRoleId}
          onChange={(option) => setTargetRoleId(option.id)}
          placeholder="Select a role..."
        />
      </Card>

      {targetRoleId && (
        <>
          <SkillGapDisplay 
            matchingSkills={skillGap.matching}
            missingSkills={skillGap.missing}
          />
          
          <div className={styles.recommendationsSection}>
            <h2 className={styles.sectionTitle}>AI Learning Recommendations</h2>
             {error && <p className={styles.errorText}>{error}</p>}
            {loadingRecs ? <div className={styles.centerContainer}><Spinner /></div> : (
              aiRecs.length > 0 ? (
                <div className={styles.recommendationsGrid}>
                  {aiRecs.map((rec, index) => (
                     <AiRecommendation key={index} recommendation={rec} />
                  ))}
                </div>
              ) : (
                <Card>
                  <p>No AI recommendations generated, or you have all the required skills!</p>
                </Card>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;