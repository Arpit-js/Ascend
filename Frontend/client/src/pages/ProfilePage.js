import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import CustomDropdown from '../components/common/CustomDropdown';
import './ProfilePage.css';

const ProfilePage = () => {
  const { session, profile: contextProfile, loading: contextLoading } = useUser();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [userSkillIds, setUserSkillIds] = useState(new Set());
  const [allSkills, setAllSkills] = useState([]);
  const [skillToAdd, setSkillToAdd] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile);
      setName(contextProfile.name || '');
      setTitle(contextProfile.title || '');
    }

    const getPageData = async () => {
      const { data: allSkillsData } = await supabase.from('skills').select('*');
      if (allSkillsData) setAllSkills(allSkillsData);

      if (session?.user) {
        const { data: userSkillsData } = await supabase.from('user_skills').select('skill_id').eq('user_id', session.user.id);
        if (userSkillsData) setUserSkillIds(new Set(userSkillsData.map(s => s.skill_id)));

        const { data: achievementsData } = await supabase.from('achievements').select('*').eq('user_id', session.user.id);
        if (achievementsData) setAchievements(achievementsData);
      }
    };
    
    getPageData();
  }, [session, contextProfile]);

  const handleProfileUpdate = async () => {
    const { data, error } = await supabase
      .from('users')
      .update({ name: name, title: title })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      setProfile(data);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    if(profile) {
      setName(profile.name);
      setTitle(profile.title || '');
    }
    setIsEditing(false);
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (!skillToAdd) return;
    const { error } = await supabase
      .from('user_skills')
      .insert({ user_id: session.user.id, skill_id: skillToAdd.id });
    if (error) {
      alert(error.message);
    } else {
      setUserSkillIds(prev => new Set(prev).add(skillToAdd.id));
      setSkillToAdd('');
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', session.user.id)
      .eq('skill_id', skillId);
    if (error) {
      alert(error.message);
    } else {
      setUserSkillIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(skillId);
        return newSet;
      });
    }
  };

  const availableSkillsToAdd = allSkills.filter(skill => !userSkillIds.has(skill.id));
  const userSkills = allSkills.filter(skill => userSkillIds.has(skill.id));

  if (contextLoading || !profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-grid">
        <Card className="profile-card">
          <img 
            src={profile.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`} 
            alt={profile.name} 
            className="profile-avatar-large" 
          />
          <div className="profile-header">
            <div className="profile-info">
              {isEditing ? (
                <div className="edit-details">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="profile-input" />
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="profile-input" placeholder="Your title" />
                </div>
              ) : (
                <>
                  <h2>{profile.name}</h2>
                  <p className="profile-title">{profile.title}</p>
                  <p className="profile-email">{session.user.email}</p>
                </>
              )}
            </div>
          </div>
          <div className="profile-divider"></div>
          <div className="profile-details-grid">
            <span>Department:</span><span>{profile.department || 'N/A'}</span>
            <span>Experience:</span><span>{profile.experience || 'N/A'}</span>
            <span>Location:</span><span>{profile.location || 'N/A'}</span>
          </div>
          <div className="profile-actions-footer">
            {isEditing ? (
              <>
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
                <Button onClick={cancelEdit} variant="secondary">Cancel</Button>
              </>
            ) : (
              <Link to="/edit-profile" className="profile-edit-button">
                <span>✏️</span> Edit Profile
              </Link>
            )}
          </div>
        </Card>
        <div className="profile-right-column">
          <Card className="skills-card">
            <h3>My Skillset</h3>
            <div className="skills-list">
              {userSkills.map(skill => (
                <span key={skill.id} className="skill-badge-removable">
                  {skill.name} 
                  <span onClick={() => handleRemoveSkill(skill.id)} className="remove-icon">&times;</span>
                </span>
              ))}
            </div>
            {isAddingSkill ? (
              <form onSubmit={handleAddSkill} className="add-skill-form">
                <CustomDropdown
                  options={availableSkillsToAdd}
                  selectedValue={skillToAdd?.id}
                  onChange={(option) => setSkillToAdd(option)}
                  placeholder="Select a skill..."
                  displayKey="name"
                />
                <Button type="submit">Add</Button>
                <Button type="button" variant="secondary" onClick={() => setIsAddingSkill(false)}>Cancel</Button>
              </form>
            ) : (
              <button className="add-skill-button" onClick={() => setIsAddingSkill(true)}>
                <span>+</span> Add Skill
              </button>
            )}
          </Card>
          <Card className="goals-card">
            <h3>Career Goals</h3>
            <p>{profile.career_goals || 'Not specified.'}</p>
          </Card>
          <Card className="achievements-card">
            <h3>Recent Achievements</h3>
            <div className="achievements-list">
              {achievements.map((item) => (
                <div key={item.id} className="achievement-item">
                  <span className="achievement-dot"></span>
                  <div className="achievement-text">
                    <h4 className="achievement-title">{item.title}</h4>
                    <p className="achievement-subtitle">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;