import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({})
  const handleNavigate = (path) => {
    navigate(path);
};

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const formData = {
        username: username, // Assuming you have state variables for these
        email: email,
        password: password,
        password_confirmation: confirmPassword, // Make sure this matches what you have in the state
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          navigate('/login'); // Adjust this to your login route as needed
        } else {
          const errorData = await response.json();
          console.error('Registration error:', errorData);
          setErrors(errorData)
          // Optionally, inform the user about the error (e.g., using a state variable to display an error message)
        }
      } catch (error) {
        // Handle network errors (e.g., server is down)
        console.error('Registration error:', error);
        // Optionally, inform the user about the error
      }
    };

  return (
    <div>
      <PublicHeader/>
    <div className="register-form-container" style={{marginTop:'40px'}}>
      <div className="register-form-inner" style={{padding:'20px 40px'}}>
        <form onSubmit={handleSubmit}>
          <h2> REGISTER HERE</h2>
          {errors.general && <div className="error-message">{errors.general}</div>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              {errors.password && errors.password.map((error, index) => (
                <p key={index} className="error-message" style={{textAlign:'center'}}>{error}</p>
            ))}
            </div>
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.non_field_errors && <div className='error-message'>{errors.non_field_errors}</div>}

            <button type="submit">Register</button>

          <div className='inquiry-footer'>
            <p className='inquiry-text'>Already have an account?</p>
            <a className='inquiry-link' onClick={() => handleNavigate('/login')} >Login here</a>
          </div>
      </form>
    </div>
    </div>
    </div>
  )
}

export default RegistrationForm
