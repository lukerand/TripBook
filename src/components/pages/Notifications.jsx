import React, { useEffect, useState } from 'react';
import  supabase  from '../../services/supabaseClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();

    const notificationChannel = supabase.channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications((prevNotifications) => [payload.new, ...prevNotifications]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
    };
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
      {notifications.map((notification) => (
        <div key={notification.id}>{notification.message}</div>
      ))}
    </div>
  );
};

export default Notifications;
