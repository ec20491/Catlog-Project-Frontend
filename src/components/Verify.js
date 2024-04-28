import React, {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Verify = ({postId, userId, verifyList, onVerifyChange}) => {
  const userid = jwtDecode(localStorage.getItem('token')).user_id;
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate()
  const [userProfile,setUserProfile] = useState([]);
  const [vetProfessional,setVetProfessional] = useState([false]);
  const toggleLikeUrl = `http://127.0.0.1:8000/api/toggle-verify/${postId}/`;

  useEffect(() => {
    // Ensure that both verifyList and userid are defined and ready before performing the check.
    if (verifyList && userid) {
        const isVerifiedByCurrentUser = verifyList.some(verify => verify.id === userid);
        setIsVerified(isVerifiedByCurrentUser);
    }
}, [verifyList, userid]);

    const handleVerifyClick = async () => {
      try {
          const response = await fetch(toggleLikeUrl, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
          });
          const data = await response.json();
          if (response.ok) {
            console.log("sucess")
              setIsVerified(isVerified => ! isVerified);
              if (data.action === 'verified') {
                onVerifyChange(1);
              }
              else if (data.action === 'verify'){
                onVerifyChange(-1);
              }
              
  
          } else {
              console.error('Failed to toggle verify status');
          }
      } catch (error) {
          console.error('Error:', error);
      }
    }


  const icon = isVerified
    ? require('../images/verified.png') // Path to your filled heart icon for "unlike"
    : require('../images/verify.png'); // Path to your heart icon for "like"

  const token = localStorage.getItem('token');
  let isTokenExpired = true;
  let decodedToken = null;
    if (token) {
        decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp > currentTime) {
            isTokenExpired = false;
        }
    }
  useEffect(() => {
    if (isTokenExpired) {
      // If the token is expired or not valid, navigate to login
      console.log('Token is expired or not valid.');
      navigate('/login');
      return; // Exit early to prevent further execution
    }
    const userProfileUrl = `http://127.0.0.1:8000/api/users/${userId}`;
    const getUserProfile = async () => {
      const response = await fetch(userProfileUrl);
      const data = await response.json();
      if (response.ok) {
        setUserProfile(data);
        const isVetProfessionalVerified = data.vet_professional_info?.verified || false;
        setVetProfessional(isVetProfessionalVerified)
        
      }
    };

    getUserProfile();
  }, [userId, navigate]); 

  return (
    <div>
      {vetProfessional && (
        <div className="interaction-item-verify" >
          <img src={icon} alt={isVerified ? "Verify" : "Verified"} onClick={handleVerifyClick}  />
        </div>
      )}
      
    </div>
    
  )
}

export default Verify
