import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/pages/HomePage';
import CreatePost from './components/pages/CreatePost';
import Notifications from './components/pages/Notifications';
import PostDetails from './components/pages/PostDetails';
import ProfilePage from './components/pages/UserProfile';
import TripFeed from './components/pages/TripFeed';
import Login from './components/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Friends from './components/pages/Friends';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './components/contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <TripFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Router>
    </UserProvider>
  );
}

export default App;
