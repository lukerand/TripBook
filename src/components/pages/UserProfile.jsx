import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabaseClient';
import { UserContext } from '../contexts/UserContext';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [grade, setGrade] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();
  const { setUserProfilePicture } = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        navigate('/login'); // Redirect to login page if not authenticated
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.details.includes('The result contains 0 rows')) {
        // If no profile exists, create one
        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, full_name: user.email }]) // Assuming email as the initial full_name
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          setLoading(false);
          return;
        }

        setProfile(data);
        setBio(data.bio || '');
        setGrade(data.grade || '');
        setAge(data.age || '');
        setProfilePictureUrl(data.profile_picture || '');
      } else if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      } else {
        setProfile(profile);
        setBio(profile.bio || '');
        setGrade(profile.grade || '');
        setAge(profile.age || '');
        setProfilePictureUrl(profile.profile_picture || '');
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
    setProfilePicture(file);
    setProfilePictureUrl(URL.createObjectURL(file));
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);

    let updatedProfilePictureUrl = profilePictureUrl;

    if (profilePicture) {
      const fileExt = profilePicture.name.split('.').pop();
      const fileName = `${profile.id}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, profilePicture, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading profile picture:', error);
        setLoading(false);
        return;
      }

      const { publicURL, error: publicUrlError } = supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        setLoading(false);
        return;
      }

      updatedProfilePictureUrl = publicURL;
      setUserProfilePicture(publicURL); // Update the profile picture in the navbar
    }

    const updates = {
      bio,
      grade,
      age,
      profile_picture: updatedProfilePictureUrl
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      setProfile({ ...profile, ...updates });
    }

    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div>
      <h1>{profile.full_name || 'No name provided'}</h1>
      {profilePictureUrl ? (
        <img src={profilePictureUrl} alt="Profile" />
      ) : (
        <div>No profile picture available</div>
      )}
      <div>
        <label htmlFor="profile-picture">Upload Profile Picture</label>
        <input
          type="file"
          id="profile-picture"
          accept="image/*"
          onChange={handleProfilePictureChange}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={handleBioChange}
        />
      </div>
      <div>
        <label htmlFor="grade">Grade</label>
        <input
          type="text"
          id="grade"
          value={grade}
          onChange={handleGradeChange}
        />
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={handleAgeChange}
        />
      </div>
      <button onClick={handleProfileUpdate}>Update Profile</button>
      <div>
        <h2>Profile Preview</h2>
        {profilePictureUrl ? (
          <img src={profilePictureUrl} alt="Profile Preview" />
        ) : (
          <div>No profile picture available</div>
        )}
        <p>{bio || 'No bio available'}</p>
        <p>{age ? `Age: ${age}` : 'No age provided'}</p>
        <p>{grade || 'No grade provided'}</p>
      </div>
    </div>
  );
};

export default UserProfile;
