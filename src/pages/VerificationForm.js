import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function VerificationForm({ onVerified }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/verify-email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ verification_code: code })
    });

    if (response.ok) {
      navigate('/dashboard'); // Navigate to the dashboard or another appropriate page
    } else {
      const data = await response.json();
      setError(data.message);
    }
  };

  return (
    <div>
      <Header/>
      <div className="login-form-container" style={{marginTop:'80px'}}>
      <div className="form-inner" >
        <form onSubmit={handleSubmit}>
          <h2> Enter your verification code</h2>
         
          <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button type="submit">Verify</button>
        {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
    </div>
  
  );
}

export default VerificationForm;