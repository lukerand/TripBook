// src/components/pages/Friends.jsx
import React, { useState } from 'react';
import  supabase  from '../../services/supabaseClient';

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('auth.users')
      .select('id, username, email, profile_picture, bio, age, grade')
      .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);

    if (error) {
      console.error(error);
      return;
    }

    setResults(data);
  };

  const handleAddFriend = async (friendId) => {
    const user = await supabase.auth.getUser();
    if (user.data.user) {
      const { error } = await supabase
        .from('friends')
        .insert([{ user_id: user.data.user.id, friend_id: friendId }]);

      if (error) {
        console.error(error);
        alert('Failed to add friend.');
      } else {
        alert('Friend request sent successfully.');
        setFriendRequests([...friendRequests, friendId]);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, or username"
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((user) => (
          <div key={user.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
            <img src={user.profile_picture} alt={`${user.username}'s profile`} width="50" height="50" />
            <h3>{user.username}</h3>
            <p>{user.bio}</p>
            <p>Age: {user.age}</p>
            <p>Grade: {user.grade}</p>
            <button 
              onClick={() => handleAddFriend(user.id)}
              disabled={friendRequests.includes(user.id)}
            >
              {friendRequests.includes(user.id) ? 'Request Sent' : 'Add Friend'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
