import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import supabase from '../services/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Allow access to the home page even if not authenticated
  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
