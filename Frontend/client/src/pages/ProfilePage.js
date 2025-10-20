import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../supabaseClient';
import styles from './ProfilePage.module.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import DefaultAvatar from '../assets/user-fill.png';

const ProfilePage = () => {
  const { profile, user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select('skills (id, name)')
          .eq('user_id', user.id);
        if (skillsError) throw skillsError;
        setUserSkills(skillsData.map(s => s.skills).filter(Boolean));

        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (achievementsError) throw achievementsError;
        setAchievements(achievementsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  if (userLoading || loading) {
    return <div className={styles.centerContainer}><Spinner size="large" /></div>;
  }

  if (error) {
    return <div className={styles.centerContainer}><p className={styles.errorText}>{error}</p></div>;
  }

  if (!profile) {
    return <div className={styles.centerContainer}><p>Could not load profile. Please try refreshing.</p></div>;
  }

  const avatarUrl = profile.avatar_url || DefaultAvatar;

  return (
    <div className={styles.profilePage}>
      <Card className={styles.profileHeader}>
        <img 
          src={avatarUrl} 
          alt="Profile Avatar" 
          className={styles.avatar}
          onError={(e) => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
        />
        <div className={styles.headerInfo}>
          <h1 className={styles.profileName}>{profile.name}</h1>
          <p className={styles.profileTitle}>{profile.title || 'No title set'}</p>
          <p className={styles.profileLocation}>{profile.location || 'No location set'}</p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/profile/edit')}
          className={styles.editButton}
        >
          Edit Profile
        </Button>
      </Card>

      <div className={styles.profileGrid}>
        <Card className={styles.infoCard}>
          <h2 className={styles.cardTitle}>About</h2>
          <div className={styles.infoGrid}>
            <InfoItem label="Full Name" value={profile.name} />
            <InfoItem label="Email" value={profile.email} />
            <InfoItem label="Title" value={profile.title} />
            <InfoItem label="Department" value={profile.department} />
            <InfoItem label="Location" value={profile.location} />
            <InfoItem label="Experience" value={profile.experience} />
          </div>
          <h3 className={styles.cardSubtitle}>Career Goals</h3>
          <p className={styles.bio}>{profile.career_goals || 'No career goals set.'}</p>
        </Card>

        <Card className={styles.skillsCard}>
          <h2 className={styles.cardTitle}>My Skills</h2>
          {userSkills.length > 0 ? (
            <div className={styles.skillTags}>
              {userSkills.map(skill => (
                <span key={skill.id} className={styles.skillTag}>{skill.name}</span>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No skills added yet. Go to "Edit Profile" to add your skills.</p>
          )}
        </Card>
      </div>

      <Card className={styles.achievementsCard}>
        <h2 className={styles.cardTitle}>Achievements</h2>
        {achievements.length > 0 ? (
          <ul className={styles.achievementList}>
            {achievements.map(ach => (
              <li key={ach.id} className={styles.achievementItem}>
                <span className={styles.achievementDate}>{new Date(ach.date).toLocaleDateString()}</span>
                <h3 className={styles.achievementTitle}>{ach.title}</h3>
                <p className={styles.achievementDesc}>{ach.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>No achievements added yet. Go to "Edit Profile" to log them.</p>
        )}
      </Card>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className={styles.infoItem}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value || '-'}</span>
  </div>
);

export default ProfilePage;