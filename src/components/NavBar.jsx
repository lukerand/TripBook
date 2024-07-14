import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import supabase from '../services/supabaseClient';
import { UserContext } from './contexts/UserContext';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const { userProfilePicture } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Trip Planner
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/create-post">
          Create Post
        </Button>
        <Button color="inherit" component={Link} to="/notifications">
          Notifications
        </Button>
        <Button color="inherit" component={Link} to="/friends">
          Friends
        </Button>
        <Button color="inherit" component={Link} to="/trips">
          Trips
        </Button>
        {user ? (
          <>
            <Avatar
              alt="Profile"
              src={userProfilePicture || 'https://via.placeholder.com/50'}
              component={Link}
              to="/profile"
              style={{ marginLeft: '10px' }}
            />
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Avatar
              alt="Profile"
              src="https://via.placeholder.com/50"
              component={Link}
              to="/profile"
              style={{ marginLeft: '10px' }}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
