import React from 'react'
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeeMoreText from './SeeMoreText';
import { jwtDecode } from 'jwt-decode';

// import SingleComment from './SingleComment';

const formatDate = (createdAt) => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - postDate; // difference in milliseconds
    const diffSecs = diffMs / 1000;
    const diffMins = diffSecs / 60;
    const diffHours = diffMins / 60;
    const diffDays = diffHours / 24;
    const diffWeeks = diffDays / 7;
  
    if (diffHours<1){
      if (diffMins <1){
        return `${Math.round(diffSecs)}s `; 
      }
      return `${Math.round(diffMins)}m `;
    }
    else if (diffHours < 24) {
      return `${Math.round(diffHours)}h `;
    } else if (diffDays < 7) {
      return `${Math.round(diffDays)}d`;
    } else if (diffWeeks <= 4) {
      return `${Math.round(diffWeeks)}w`;
    } else if (postDate.getFullYear() === now.getFullYear()) {
      return postDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } else {
      return postDate.toLocaleDateString('en-GB');
    }
  };

function getFullImageUrl(imageUrl) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl; 
    } else {
      return `http://127.0.0.1:8000${imageUrl}`;
    }
  }

const Comments = ({comment, onReplyClick, onDeleteClick}) => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token).user_id;    
    const [showReplies, setShowReplies] = useState(false);
    const navigate = useNavigate();
    // console.log(comment.author.id)
    // console.log(user.user_id)

    const handleUserNavigate = (authorId) => {
      navigate(`/profile/${authorId}`);
        };

        


  return  (
    <div className='comment-item'>
      <div style={{ display: 'flex' }}>
        {comment.author.profile_image && (
          <img className='comment-profile-img' src={getFullImageUrl(comment.author.profile_image)} alt="Profile"
            onClick={() => handleUserNavigate(comment.author.id)}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 ,flexDirection:'column', paddingRight:'10px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <strong style={{ fontWeight: 'bold', fontSize: '1rem' }} onClick={() => handleUserNavigate(comment.author.id)}>
              {comment.author.username}
            </strong>
            {comment.author.verified && (
              <img className='verified-icon-small' src={require('../images/verified.png')} alt="Verified" style={{ marginLeft: '5px', marginRight: '5px' }} />
            )}
            <SeeMoreText className='comment-desc1' text={comment.text} maxLength={100} style={{ flexBasis: '100%', marginTop: '5px' }} />
          </div>
        </div>
                <div  className = 'reply-comment' >
                    <span style={{ marginRight: '10px' }}>{formatDate(comment.created_at)}</span>
                    <span style={{ cursor: 'pointer',marginRight: '10px' }} onClick={() => onReplyClick(comment.id, comment.author.username)}>
                      Reply
                    </span>
                    
                    {comment.replies && comment.replies.length > 0 && (
                    <div>     
                      <span className='show-reply-comment'
                          onClick={() => setShowReplies(!showReplies)}
                          >
                          {showReplies ? '---- Hide replies' : `---- View replies (${comment.replies.length})`}
                      </span>
                    </div>
                    )}
                    {comment.author.id === user && (
                      <span style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => onDeleteClick(comment.id)}>
                        Delete
                      </span>
                    )}

                </div>
                {comment.replies && comment.replies.length > 0 && (
                  <div>     
                

                    {showReplies && (
                        <div style={{ }}>
                        {comment.replies.map((reply, index) => (
                            <Comments key={reply.id || index} comment={reply} onReplyClick={onReplyClick} />
                        ))}
                        </div>
                    )}
                  </div>
          )}
              
        
        </div>
      </div>      
    </div>
  );
};


export default Comments
