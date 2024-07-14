import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../../services/supabaseClient'; // Use the existing import

export default function Login() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/profile'); // Redirect to profile if session exists on initial load
      }
    });

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/profile'); // Redirect to profile if session exists after auth state change
      }
    });

    // Cleanup subscription on unmount
    return () => {
      if (authListener && typeof authListener.subscription.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (!session) {
    return (
      <div className="auth-container">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    );
  } else {
    return (
      <div>
        <h2>Welcome, you are logged in!</h2>
      </div>
    );
  }
}
