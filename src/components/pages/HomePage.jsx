import React from 'react';
import { Container, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to Trip Planner
      </Typography>
      <Typography variant="body1">
        Plan and manage your trips easily with our platform.
      </Typography>
    </Container>
  );
};

export default HomePage;
