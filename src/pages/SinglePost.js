import React, {useState, useRef, useEffect} from 'react';
import Comments from '../components/Comments';
import Like from '../components/Like'
import Verify from '../components/Verify'
import { jwtDecode } from 'jwt-decode';
import SeeMoreText from '../components/SeeMoreText';
import { useNavigate } from 'react-router-dom';
import StatsModal from '../components/StatsModal'
import DisplayItemModal from '../components/DisplayItemModal';
import SinglePostModal from '../components/SinglePostModal';
import ShowStats from '../components/ShowStats';
import EditPost from '../components/EditPost';
import DeletePost from '../components/DeletePost';
import ReportPost from '../components/ReportPost';
// Destructure the `post` object directly in the function parameters
const formatDate = (createdAt) => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 1) {
      // Less than 24 hours ago
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hours ago`;
    } else if (postDate.getFullYear() === now.getFullYear()) {
      // Within the current year
      return postDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    } else {
      // Older posts
      return postDate.toLocaleDateString('en-GB'); // Formats as D/M/Y for UK locale
    }
  };


  const addReplyToComments = (comments, newReply) => {
    // Handle new top-level comment
    if (newReply.parent === null) {
      return [...comments, newReply];
    }

    // Handle replies
    return comments.map((comment) => {
      if (comment.id === newReply.parent) {
        // Check if this comment is the parent of the new reply
        const updatedReplies = comment.replies ? [...comment.replies, newReply] : [newReply];
        return { ...comment, replies: updatedReplies };
      } else if (comment.replies) {
        // If this comment has replies, recursively update them
        return { ...comment, replies: addReplyToComments(comment.replies, newReply) };
      } else {
        // If neither, return the comment unchanged
        return comment;
      }
    });
  };

const SinglePost = ({ post }) => {
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const navigate = useNavigate();
  const userid = jwtDecode(localStorage.getItem('token')).user_id;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [parentId, setParentId] = useState(null);
  const [likeCount, setLikeCount] = useState(post.total_likes);
  const [verifyCount, setVerifyCount] = useState(post.total_verifies);
  const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
  let isTokenExpired = true;
  let decodedToken = null;
  const token = localStorage.getItem('token');
  let currentUserId = null;
    if (token) {
        decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp > currentTime) {
            isTokenExpired = false;
        }
    }
  currentUserId = jwtDecode(localStorage.getItem('token')).user_id;

  const handleUserNavigate = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set to scroll height
    }
  }, [text]); 

  useEffect(() => {
    setComments(post.comments || []); // Initialize comments state with post.comments
  }, [post.comments]); // Re-run if post.comments changes

  const handleLikeChange = (increment) => {
    setLikeCount(prevLikes => prevLikes + increment);
  };

  const handleVerifyChange = (increment) =>{
    setVerifyCount(prevVerifies => prevVerifies + increment);
  }

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  // this give parent comment id if avalible from Comments components 
  const handleReplyClick = (commentId, commentUsername) => {
    setParentId(commentId)
    console.log(commentUsername)
    const replyText = `@${commentUsername} `;  // Prepends '@' to the username and adds a space
    setText(replyText); 
    textareaRef.current.focus();
  };

  const handleDelete = async (commentId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/comments/delete/${commentId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        setComments(currentComments => {
            return currentComments.filter(comment => comment.id !== commentId);
        });
    } else {
        alert('Failed to delete comment');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    let token = localStorage.getItem('token')
    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments/create/', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post: post.id,
          parent: parentId,
          text: text, 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newReply = await response.json();
      setComments((currentComments) => addReplyToComments(currentComments, newReply));
      setText('');  // Clear the textarea
    } catch (error) {
      console.error('Error submitting the comment:', error);
    } finally {
      setIsLoading(false);
    }
  };




  const handleEditComplete = () => {
    setShowDropdown(false);
    console.log('Edit complete');
  };

  const handleDeleteComplete = () => {
      setShowDropdown(false);
      console.log('Delete complete');
      handleUserNavigate(post.author_id)
  };


  return (
    <div className='posts-list-item'>

      <div className='post-item-header' style={{ display: 'flex', alignItems: 'center' }}>
        {post.author_profile_image && (
          <img src={`http://127.0.0.1:8000${post.author_profile_image}`} 
          alt="Profile" className='post-item-header-img'
          onClick={() => handleUserNavigate(post.author_id)}
           />
        )}
        <h4 className='post-item-header-name' onClick={() => handleUserNavigate(post.author_id)}>{post.author}</h4>
        {post.author_verified && (
                  <img className='verified-icon' src={require('../images/verified.png')} alt="Verified Vet Professional" />
              )}
        <h4 className='post-item-header-date'> &#xb7; {formatDate(post.created_at)}</h4>

        <div className='options-button'>
          <button className='opt-button' onClick={toggleDropdown} >
                &#x2630; {/* This is the hamburger menu icon */}
          </button>
            {showDropdown && (
                <div className="options-dropdown-menu">
                    {post.author_id === currentUserId ? (
                        <>
                        <button onClick={() => navigate(`/edit-post/${post.id}`)}>
                        Edit Post
                      </button>
                        <DeletePost post={post} onDeleteComplete={handleDeleteComplete} />
                        </>
                    ) : (
                        <button onClick={()=>setIsReportModalOpen(true)}>Report post</button>
                        
                    )}
                </div>
            )}

              <ReportPost 
                onClose={() => setIsReportModalOpen(false)}
                open={isReportModalOpen}
                postId={post.id}
                 />
    
        </div>      


      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div>
            <div className='display-image' >
              <img src={`http://127.0.0.1:8000${post.media}`} onClick={()=>setIsPostModalOpen(true)} alt="Project Media" />
            </div>
            

                <SinglePostModal 
                onClose={() => setIsPostModalOpen(false)}
                open={isPostModalOpen}
                post={post}
                onReplyClick={handleReplyClick}
                onDeleteClick={handleDelete}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                isLoading={isLoading}
                text={text}
                textareaRef={textareaRef}
                comments={comments}
                 />
              


            <div className='interaction' >
                <div className="interaction-item"> 
                  {/* <div style={{display:'flex'}}> */}
                    <Like
                      postId={post.id}
                      userLikesList={post.user_likes_list}
                      onLikeChange={handleLikeChange}
                    />
                   
                  {/* </div> */}
                  
                </div>
              
                <div className="interaction-item">
                  <button onClick={() => setShowComments(!showComments)}>
                      <img src={require('../images/comment.png')} alt="Comment"  />
                  </button>
                </div>

                 <Verify 
                    postId={post.id} 
                    userId={userid} 
                    verifyList={post.user_verifies_list}
                    onVerifyChange={handleVerifyChange}/>
          </div>

          
        </div>
      </div>

      <div style={{ maxWidth: '35vw'}}>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <strong style={{ fontWeight: 'bold', fontSize: '1rem' }}>{post.author}</strong>
            {post.author_verified && (
              <img className='verified-icon-small' src={require('../images/verified.png')} alt="Verified Vet Professional" />
            )}
            <SeeMoreText text={post.content} maxLength={100} />
        </div>
      </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px',flexDirection:'row' }}>
          <div style={{display:'flex', flexDirection:'row', gap: '10px',  alignItems: 'center'}}>
            <p onClick={()=>setIsLikesModalOpen(true)}>{likeCount}</p>
            <img className='verified-icon-small' src={require('../images/heart-filled.png')} alt="Verified Vet Professional" />
          </div>
            <StatsModal open={isLikesModalOpen} onClose={() => setIsLikesModalOpen(false)}>
              <ShowStats list={post.user_likes_list}/>
            </StatsModal>
            <div style={{display:'flex', flexDirection:'row', gap: '10px',  alignItems: 'center'}}>
              <p onClick={()=>setIsVerifyModalOpen(true)}> {verifyCount}</p>
              <img className='verified-icon-small' src={require('../images/verified.png')} alt="Verified" />
          </div>
            <StatsModal open={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)}>
                <ShowStats list={post.user_verifies_list} />
            </StatsModal>
        </div>
            



        {/* Button to toggle the visibility of comments */}
        {comments && comments.length > 0 && (
            <span onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer', margin: '10px 0', marginTop: '20px', color: '#666' }}>
              {showComments ? 'Hide Comments' : `View all ${comments.length} comments `}
            </span>
          )}
       <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
        
          {/* Conditionally render comments based on showComments state */}
          {showComments && comments.map((comment, index) => (
            <div key={index} style={{width:'35vw'}}>
              <Comments comment={comment} onReplyClick={handleReplyClick} onDeleteClick={handleDelete}/>
            </div>
          ))}
    </div>
    <form className='comment-form' onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', width: '35vw', marginTop: '5px', padding:'5px' }}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        placeholder="Write a comment..."
        style={{ 
          flexGrow: 1, 
          resize: 'none', 
          overflow: 'hidden', 
          minHeight: '20px', // Minimum height for single line
          lineHeight: '24px', // Adjust lineHeight as needed
          marginRight: '10px' 
        }}
        rows={1}
      />
      <button className='comment-submit-button' type="submit" disabled={isLoading} style={{ 
          alignSelf: 'center', // Align button vertically in the middle
          height: 'fit-content', 
          padding: '5px 10px',
          cursor: 'pointer' // Ensure the cursor changes to pointer on hover over the button
          }}> Post
      </button>
    </form>

    </div>
  );
}

export default SinglePost;