import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const { session, profile: contextProfile, refetchProfile } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (contextProfile) {
      setName(contextProfile.name || '');
      setTitle(contextProfile.title || '');
      setDepartment(contextProfile.department || '');
      setExperience(contextProfile.experience || '');
      setLocation(contextProfile.location || '');
      setCareerGoals(contextProfile.career_goals || '');
      setAvatarUrl(contextProfile.avatar_url || '');

      const getAchievements = async () => {
        const { data } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', contextProfile.id);
        if (data) setAchievements(data);
      };
      
      getAchievements();
    }
    setLoading(false);
  }, [contextProfile]);

  const handleAchievementChange = (index, field, value) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index][field] = value;
    setAchievements(updatedAchievements);
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: '', subtitle: '' }]);
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${session.user.id}/${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
    
    if (uploadError) {
      alert('Error uploading avatar.');
      console.error(uploadError);
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error: profileError } = await supabase
      .from('users')
      .update({ name, title, department, experience, location, career_goals: careerGoals, avatar_url: avatarUrl })
      .eq('id', session.user.id);

    const { error: deleteError } = await supabase
      .from('achievements')
      .delete()
      .eq('user_id', session.user.id);

    const achievementsToInsert = achievements
      .filter(a => a.title)
      .map(a => ({ user_id: session.user.id, title: a.title, subtitle: a.subtitle }));
    
    const { error: achievementsError } = await supabase
      .from('achievements')
      .insert(achievementsToInsert);

    if (profileError || deleteError || achievementsError) {
      alert('An error occurred while saving.');
      setLoading(false);
    } else {
      await refetchProfile();
      setLoading(false);
      alert('Profile saved successfully!');
      navigate('/profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-profile-page">
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSave}>
        <Card>
          <h3>Profile Picture</h3>
          <div className="avatar-upload-section">
            <img src={avatarUrl || `https://i.pravatar.cc/150?u=${session.user.id}`} alt="Avatar" className="edit-avatar" />
            <input type="file" id="avatar-upload" onChange={handleAvatarUpload} disabled={uploading} accept="image/*" />
            <label htmlFor="avatar-upload" className="upload-label">{uploading ? 'Uploading...' : 'Upload Image'}</label>
          </div>
        </Card>
        <Card>
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Experience</label>
              <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
        </Card>
        <Card>
          <h3>Career Goals</h3>
          <div className="form-group">
            <textarea value={careerGoals} onChange={(e) => setCareerGoals(e.target.value)} rows="4" />
          </div>
        </Card>
        <Card>
          <h3>Recent Achievements</h3>
          {achievements.map((ach, index) => (
            <div key={index} className="achievement-edit-item">
              <input type="text" placeholder="Achievement Title" value={ach.title} onChange={(e) => handleAchievementChange(index, 'title', e.target.value)} />
              <input type="text" placeholder="Subtitle or Description" value={ach.subtitle} onChange={(e) => handleAchievementChange(index, 'subtitle', e.target.value)} />
              <button type="button" className="remove-button" onClick={() => removeAchievement(index)}>&times;</button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addAchievement}>+ Add Achievement</Button>
        </Card>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save All Changes'}</Button>
      </form>
    </div>
  );
};

export default EditProfilePage;