import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../supabaseClient';
import styles from './EditProfilePage.module.css';

import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CustomDropdown from '../components/common/CustomDropdown';
import { FormGroup, Label, Input, Textarea } from '../components/common/FormControls';
import DefaultAvatar from '../assets/user-fill.png';

const EditProfilePage = () => {
  const { profile, user, refetchProfile } = useUser();
  const navigate = useNavigate();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Data state
  const [allSkills, setAllSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    location: '',
    experience: '',
    career_goals: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // New Achievement form
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchDate, setNewAchDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New Skill form
  const [newSkillId, setNewSkillId] = useState(null);

  // Load all necessary data
  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;
      setLoading(true);
      setError(null);
      try {
        setFormData({
          name: profile.name || '',
          title: profile.title || '',
          department: profile.department || '',
          location: profile.location || '',
          experience: profile.experience || '',
          career_goals: profile.career_goals || '',
        });
        setAvatarPreview(profile.avatar_url || DefaultAvatar);

        // Fetch all skills
        const { data: allSkillsData, error: allSkillsError } = await supabase.from('skills').select('id, name');
        if (allSkillsError) throw allSkillsError;
        setAllSkills(allSkillsData);

        // Fetch user's skills
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('user_skills')
          .select('id, skills (id, name)') // 'id' here is the user_skills join table ID
          .eq('user_id', user.id);
        if (userSkillsError) throw userSkillsError;
        setUserSkills(userSkillsData);
        
        // Fetch achievements
        const { data: achData, error: achError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (achError) throw achError;
        setAchievements(achData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile, user.id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // --- SAVE FUNCTIONS ---

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      let avatarUrl = profile.avatar_url; // Keep existing one by default

      // 1. If new avatar, upload it
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/avatar_${new Date().getTime()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true }); // upsert = true to overwrite
        
        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }

      // 2. Update the user's profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ ...formData, avatar_url: avatarUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setMessage('Profile updated successfully!');
      await refetchProfile(); // Refetch profile in context
      navigate('/profile'); // Go back to profile page

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillId) return;
    
    // Check if user already has this skill
    if (userSkills.find(s => s.skills.id === newSkillId)) {
      setError('You already have this skill.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: newSkillId })
        .select('id, skills (id, name)'); // Return the new item
      
      if (error) throw error;
      setUserSkills([...userSkills, data[0]]);
      setNewSkillId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveSkill = async (userSkillId) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', userSkillId); // Delete by the user_skills row ID
      
      if (error) throw error;
      setUserSkills(userSkills.filter(s => s.id !== userSkillId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    if (!newAchTitle || !newAchDate) {
      setError('Title and Date are required for achievements.');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          title: newAchTitle,
          description: newAchDesc,
          date: newAchDate,
        })
        .select();
      
      if (error) throw error;
      setAchievements([data[0], ...achievements]); // Add to top of list
      setNewAchTitle('');
      setNewAchDesc('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveAchievement = async (achievementId) => {
     try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', achievementId);
      
      if (error) throw error;
      setAchievements(achievements.filter(a => a.id !== achievementId));
    } catch (err) {
      setError(err.message);
    }
  };

  // --- RENDER ---
  
  if (loading) {
    return <div className={styles.centerContainer}><Spinner size="large" /></div>;
  }

  // Filter skills dropdown to only show skills user *doesn't* have
  const availableSkillsToAdd = allSkills.filter(
    (skill) => !userSkills.find(userSkill => userSkill.skills.id === skill.id)
  );

  return (
    <div className={styles.editPage}>
      <h1 className={styles.pageTitle}>Edit Profile</h1>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
      {message && <p className={styles.successMessage}>{message}</p>}

      <form onSubmit={handleSaveProfile}>
        <Card>
          <h2 className={styles.cardTitle}>Public Information</h2>
          <div className={styles.avatarSection}>
            <img 
              src={avatarPreview} 
              alt="Avatar Preview" 
              className={styles.avatarPreview}
              onError={(e) => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
            />
            <FormGroup>
              <Label htmlFor="avatar">Change Avatar</Label>
              <Input 
                type="file" 
                id="avatar" 
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
                className={styles.fileInput}
              />
              <p className={styles.fileHint}>Upload a .png or .jpg file.</p>
            </FormGroup>
          </div>
          
          <div className={styles.formGrid}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleFormChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g., Software Engineer" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" value={formData.department} onChange={handleFormChange} placeholder="e.g., Engineering" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleFormChange} placeholder="e.g., New York, NY" />
            </FormGroup>
            <FormGroup className={styles.fullWidth}>
              <Label htmlFor="experience">Experience</Label>
              <Textarea id="experience" name="experience" value={formData.experience} onChange={handleFormChange} placeholder="Describe your experience..." />
            </FormGroup>
            <FormGroup className={styles.fullWidth}>
              <Label htmlFor="career_goals">Career Goals</Label>
              <Textarea id="career_goals" name="career_goals" value={formData.career_goals} onChange={handleFormChange} placeholder="What are your professional goals?" />
            </FormGroup>
          </div>
          
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={() => navigate('/profile')}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner size="small" /> : 'Save Profile'}
            </Button>
          </div>
        </Card>
      </form>

      {/* --- Skills Management --- */}
      <Card>
        <h2 className={styles.cardTitle}>Manage Skills</h2>
        <div className={styles.manageList}>
          {userSkills.length > 0 ? (
            userSkills.map(userSkill => (
              <div key={userSkill.id} className={styles.manageItem}>
                <span>{userSkill.skills.name}</span>
                <button onClick={() => handleRemoveSkill(userSkill.id)} className={styles.deleteButton}>&times;</button>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>No skills added yet.</p>
          )}
        </div>
        <div className={styles.addForm}>
          <CustomDropdown
            options={availableSkillsToAdd}
            selectedValue={newSkillId}
            onChange={(option) => setNewSkillId(option.id)}
            placeholder="Select a skill to add..."
            className={styles.addFormInput}
          />
          <Button variant="secondary" onClick={handleAddSkill}>Add Skill</Button>
        </div>
      </Card>

      {/* --- Achievements Management --- */}
      <Card>
        <h2 className={styles.cardTitle}>Manage Achievements</h2>
        <form onSubmit={handleAddAchievement} className={styles.addFormGrid}>
          <FormGroup className={styles.achTitle}>
            <Label htmlFor="achTitle">Title</Label>
            <Input id="achTitle" value={newAchTitle} onChange={(e) => setNewAchTitle(e.target.value)} required />
          </FormGroup>
          <FormGroup className={styles.achDate}>
            <Label htmlFor="achDate">Date</Label>
            <Input type="date" id="achDate" value={newAchDate} onChange={(e) => setNewAchDate(e.target.value)} required />
          </FormGroup>
          <FormGroup className={styles.fullWidth}>
            <Label htmlFor="achDesc">Description</Label>
            <Textarea id="achDesc" value={newAchDesc} onChange={(e) => setNewAchDesc(e.target.value)} />
          </FormGroup>
          <Button type="submit" variant="secondary" className={styles.fullWidth}>Add Achievement</Button>
        </form>
        
        <hr className={styles.divider} />

        <div className={styles.manageList}>
           {achievements.length > 0 ? (
            achievements.map(ach => (
              <div key={ach.id} className={`${styles.manageItem} ${styles.manageItemColumn}`}>
                <div>
                  <strong>{ach.title}</strong> ({new Date(ach.date).toLocaleDateString()})
                  <p>{ach.description}</p>
                </div>
                <button onClick={() => handleRemoveAchievement(ach.id)} className={styles.deleteButton}>&times;</button>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>No achievements added yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EditProfilePage;