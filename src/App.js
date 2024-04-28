
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState }  from 'react';
import './App.css';
import Posts from "./pages/Posts";
import LoginForm from './pages/LoginForm';
import RegistrationForm from './pages/RegistrationForm';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile'
import { jwtDecode } from 'jwt-decode';
import ExplorePage from './pages/ExplorePage';
import Marketplace from './pages/Marketplace';
import UploadPost from './components/UploadPost';
import AutoSearchGoogle from './components/AutoSearchGoogle';
import CreateListing from './pages/CreateListing';
import EditPost from './components/EditPost';
import ReportPost from './components/ReportPost';
import EditItem from './components/EditItem';
import DisplaySinglePost from './pages/DisplaySinglePost';
import SearchComponent from './components/SearchComponent';
import VerificationForm from './pages/VerificationForm';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  // Handle login logic here but remove the navigate part
  const handleSubmit = async (username, password, isSuccess, onError) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.access) {
        localStorage.setItem('token', data.access);
        isSuccess(); // Call the onSuccess callback
      } else {
        onError(data.detail || "Invalid login credentials");
      }
    } catch (error) {
      onError("Login request failed. Please try again later.");
    }
  };
  
  return  (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleSubmit} />} />
        <Route path="/register" element={<RegistrationForm  />} />
        <Route path="/dashboard/" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/explore/" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/marketplace/" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/edit-profile/" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/upload-post/" element={<ProtectedRoute><UploadPost /></ProtectedRoute>} />
        <Route path="/search-area/" element={<ProtectedRoute><AutoSearchGoogle /></ProtectedRoute>} />
        <Route path="/sell-an-item/" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
        <Route path="/edit-post/:postId" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/report-post/:postId" element={<ProtectedRoute><ReportPost /></ProtectedRoute>} />
        <Route path="/edit-item/:itemId" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
        <Route path="/display-post/:postId" element={<ProtectedRoute><DisplaySinglePost /></ProtectedRoute>} />
        <Route path="/search/" element={<ProtectedRoute><SearchComponent /></ProtectedRoute>} />
        <Route path="/verify-email/" element={<ProtectedRoute><VerificationForm/></ProtectedRoute>}/>
        
      </Routes>
    </Router>
  );
}

export default App;