import React, {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';

const Like = ({ postId, userLikesList, onLikeChange }) => {
  const userid = jwtDecode(localStorage.getItem('token')).user_id;
  const [isLiked, setIsLiked] = useState(false);
  const toggleLikeUrl = `http://127.0.0.1:8000/api/toggle-like/${postId}/`;
    useEffect(() => {
      // Ensure that both verifyList and userid are defined and ready before performing the check.
      if (userLikesList && userid) {
          const isLikedByCurrentUser = userLikesList.some(like => like.id === userid);
          setIsLiked(isLikedByCurrentUser);
      }
  }, [userLikesList, userid]);
  const handleLikeClick = async () => {
    try {
        const response = await fetch(toggleLikeUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setIsLiked(isLiked => ! isLiked);
            if (data.action === 'liked') {
              onLikeChange(1);
            }
            else if (data.action === 'unliked'){
              onLikeChange(-1);
            }
            

        } else {
            console.error('Failed to toggle like status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  const icon = isLiked 
    ? require('../images/heart-filled.png') // Path to your filled heart icon for "unlike"
    : require('../images/heart.png'); // Path to your heart icon for "like"

  return (
    <button onClick={handleLikeClick}>
      <img src={icon} alt={isLiked ? "Unlike" : "Like"} />
    </button>
  );
};

export default Like;