import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import RegistrationForm from '../components/auth/RegistrationForm';
import LoginForm from '../components/auth/LoginForm';
import Profile from './pages/Profile';
import UpdateUserForm from '../components/auth/UpdateUserForm';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';


const App: React.FC = () => (
    <ChakraProvider>
        <Router>
            <Routes>
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/update" element={<UpdateUserForm />} />
                <Route path="/change-password" element={<ChangePasswordForm />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    </ChakraProvider>
);

export default App;
