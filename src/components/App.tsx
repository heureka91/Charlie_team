import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Profile from './components/pages/Profile';
import UpdateUserFormContainer from './components/auth/UpdateUserFormView';
import ChangePassword from './components/auth/ChangePasswordForm';
import ForumPage from './components/pages/ForumPage'; // Helyes import
import ForumCommentsPage from './components/pages/ForumCommentPages';
import { getToken } from './auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = getToken() || sessionStorage.getItem('token');
    setIsAuthenticated(!!storedToken);
  }, []);

  return (
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? "/forum" : "/login"} />} />
            <Route path="/login" element={<LoginForm onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/profile/edit" element={isAuthenticated ? <UpdateUserFormContainer /> : <Navigate to="/login" />} />
            <Route path="/change-password" element={isAuthenticated ? <ChangePassword /> : <Navigate to="/profile" />} />
            <Route path="/forum" element={isAuthenticated ? <ForumPage /> : <Navigate to="/login" />} />
            <Route path="/forum/:forumId/comments" element={isAuthenticated ? <ForumCommentsPage /> : <Navigate to="/login" />} /> {/* Hozzászólások útvonal */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/forum" : "/login"} />} />
          </Routes>
        </Router>
      </ChakraProvider>
  );
};

export default App;
