import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
  
    try {
      if (!token) throw new Error('No token found');
      jwtDecode(token);  // throws an error if the token is invalid
    } catch (e) {
      console.error(e);
      // Include an error message in the query parameters
      return <Navigate to={`/login?error=${encodeURIComponent(e.message)}`} replace />;
    }
  
    return children;
  };
export default ProtectedRoute;