import React, { useEffect, useState } from 'react';
import supabase from '../../services/supabaseClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TripFeed = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase.rpc('get_trips_with_creators');

        if (error) {
          console.error('Error fetching trips:', error);
        } else {
          setTrips(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {trips.map((trip) => (
        <div key={trip.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h2>{trip.origin} to {trip.destination}</h2>
          <p>Date: {trip.date}</p>
          <p>Time: {trip.time}</p>
          <p>Type: {trip.triptype}</p>
          <p>Description: {trip.description}</p>
          <div>
            <h3>Created by:</h3>
            <p>{trip.creator_name || 'Unknown'}</p>
            {trip.creator_photo_url && (
              <img src={trip.creator_photo_url} alt={trip.creator_name} width={50} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripFeed;
