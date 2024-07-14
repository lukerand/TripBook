import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, CardMedia, Typography, Box, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import  supabase  from '../../services/supabaseClient';
import GoogleMapReact from 'google-map-react';

const PostDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pairingRequested, setPairingRequested] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          id, origin, destination, date, time, tripType, description, needsMorePeople,
          creator:creator_id (name, photo_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching trip details:', error);
      } else {
        setTrip(data);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, content, created_at,
          user:user_id (name, avatar_url)
        `)
        .eq('trip_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data);
      }
    };

    fetchTripDetails();
    fetchComments();
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    const user = supabase.auth.user();
    if (!user) {
      console.error('User must be logged in to comment');
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        { content: newComment, trip_id: id, user_id: user.id }
      ]);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setComments([{ ...data[0], user: { name: user.user_metadata.full_name, avatar_url: user.user_metadata.avatar_url } }, ...comments]);
      setNewComment('');
    }
  };

  const handlePairingRequest = async () => {
    const user = supabase.auth.user();
    if (!user) {
      console.error('User must be logged in to send a pairing request');
      return;
    }

    const { data, error } = await supabase
      .from('pairing_requests')
      .insert([
        { trip_id: id, user_id: user.id }
      ]);

    if (error) {
      console.error('Error sending pairing request:', error);
    } else {
      setPairingRequested(true);
    }
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="150"
          image={trip.creator.photo_url}
          alt={trip.creator.name}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {trip.origin} to {trip.destination}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trip.date} at {trip.time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type: {trip.tripType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trip.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posted by: {trip.creator.name}
          </Typography>
          {trip.needsMorePeople && (
            <Typography variant="body2" color="error">
              Needs more people for safety
            </Typography>
          )}
          <Box sx={{ height: 300, mt: 2 }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
              defaultCenter={{ lat: 9.03, lng: 38.74 }} // Example coordinates, replace with actual
              defaultZoom={11}
            >
              {/* Optionally add markers for origin and destination */}
            </GoogleMapReact>
          </Box>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePairingRequest} disabled={pairingRequested}>
            {pairingRequested ? 'Pairing Request Sent' : 'Send Pairing Request'}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="div">
          Comments
        </Typography>
        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={comment.user.name} src={comment.user.avatar_url} />
                </ListItemAvatar>
                <ListItemText
                  primary={comment.user.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                      {" — " + comment.content}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 2, display: 'flex' }}>
          <TextField
            label="Add a comment"
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={handleCommentChange}
          />
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleAddComment}>
            Post
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PostDetails;
