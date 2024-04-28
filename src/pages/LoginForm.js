// LoginForm.js
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';


const LoginForm = ({ onLogin }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authError = queryParams.get('error');

  const [error, setError] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
};

  const handleError = (errorMessage) => {
    setError(errorMessage); // Set error message to display
  };

  const handleSuccess = () => {
    navigate('/explore'); // Navigate to dashboard on successful login
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    onLogin(username, password, handleSuccess, handleError);
  };

  return (
    <div>
      <PublicHeader/>
      <div className="login-form-container" style={{marginTop:'80px'}}>
      
      <div className="form-inner">
        <form onSubmit={handleSubmit}>
          <h2> LOGIN HERE</h2>
          {authError && <div className="error-message">{decodeURIComponent(authError)}. Please login first.</div>}
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link className='inquiry-link' to="http://127.0.0.1:8000/reset_password/">Forgot Password?</Link>
          <button type="submit">ENTER</button>
          
          <div className='inquiry-footer'>
            <p>Don's have an account?</p>
            <a className='inquiry-link' onClick={() => handleNavigate('/register')} >Register here</a>
          </div>

        </form>
      </div>
    </div>
    </div>
    
  );
};

export default LoginForm;