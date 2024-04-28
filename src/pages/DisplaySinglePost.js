import React,{useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import SeeMoreText from '../components/SeeMoreText'; 
import Comments from '../components/Comments';
import Like from '../components/Like';
import Verify from '../components/Verify';
import ShowStats from '../components/ShowStats';
import StatsModal from '../components/StatsModal';
import Header from '../components/Header';
import DeletePost from '../components/DeletePost';
import ReportPost from '../components/ReportPost';


const DisplaySinglePost = () => {
    const { postId } = useParams();
    const [parentId, setParentId] = useState(null);
    const [text, setText] = useState('');
    const userid = jwtDecode(localStorage.getItem('token')).user_id;
    const textareaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [likeCount, setLikeCount] = useState('');
    const [verifyCount, setVerifyCount] = useState('');
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const currentUserId = jwtDecode(localStorage.getItem('token')).user_id;
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/get-post/${postId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`); // Throw an error for bad responses
                }
                
                const data = await response.json();
                // console.log(data)
                setPost(data);
                //console.log(post.content)
                setComments(data.comments)
                setLikeCount(data.total_likes);
                setVerifyCount(data.total_verifies);
            } catch (err) {
                console.error('Failed to load post', err);
            }
        };
    
        fetchPost();
    }, [postId]); 

    useEffect(() => {
        console.log('Post updated:', post.content);
    }, [post]);

    const navigate = useNavigate()
    let isTokenExpired = true;
    let decodedToken = null;
    const token = localStorage.getItem('token');
        if (token) {
            decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            if (decodedToken.exp > currentTime) {
                isTokenExpired = false;
            }
        }
          const handleUserNavigate = (authorId) => {
            navigate(`/profile/${authorId}`);
          };
        const handleLikeChange = (increment) => {
            setLikeCount(prevLikes => prevLikes + increment);
          };
        const handleVerifyChange = (increment) =>{
            setVerifyCount(prevVerifies => prevVerifies + increment);
          }

        const handleDeleteComplete = () => {
            setShowDropdown(false);
            console.log('Delete complete');
            handleUserNavigate(post.author_id)
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
        const handleSubmit = async (event) => {
            event.preventDefault();
            setIsLoading(true);
            let token = localStorage.getItem('token')

            console.log("Submitting:", JSON.stringify({
              post: post?.id,  // Safe navigation operator in case post is undefined
              parent: parentId,
              text: text
            }));
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

          const handleReplyClick = (commentId) => {
            setParentId(commentId)
            console.log(commentId)
            // Optionally, focus the textarea to prompt the user to start typing their reply
            textareaRef.current.focus();
          };
          const handleInputChange = (event) => {
            setText(event.target.value);
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

        
  return (
    <div>
        <Header/>
    <div className="post-modal-container" style={{marginTop:'120px'}}>    
        <div className='post-modal-form'>
            <div className='post-modal-drop-zone'>
                <img src={`http://127.0.0.1:8000${post.media}`} alt="Project Media" />
            </div>

        
            <div className="post-modal-right">
              <div className='modal-author-desc'>
                  {post.author_profile_image && (
                  <img className='comment-profile-img' style={{height:'30px', width:'30px', borderRadius:'20px', cursor:'pointer'}} src={`http://127.0.0.1:8000${post.author_profile_image}`} alt="Profile"
                    onClick={() => handleUserNavigate(post.author_id)}
                  />
                )}
                <strong style={{ marginRight: '8px', cursor:'pointer' }} onClick={() => handleUserNavigate(post.author_id)}>{post.author}</strong>
                      {post.author_verified && (
                        <img className='verified-icon-small' src={require('../images/verified.png')} alt="Verified" />
                      )}
                      <SeeMoreText text={post.content} maxLength={100} />
                  <div className='comment-text' style={{paddingRight:'10px', overflow:'auto'}}>
                      
                  </div>
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
            
                  </div>
                  <ReportPost 
                onClose={() => setIsReportModalOpen(false)}
                open={isReportModalOpen}
                postId={post.id}
                 />
    
                  
              </div>
            


            <div className='display-post-comment-modal'>
              {comments.map((comment, index) => (
                <div key={index} >
                  <Comments comment={comment} onReplyClick={handleReplyClick} onDeleteClick={handleDelete}/>
                </div>
              ))}

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
            
            <div className='interaction' style={{marginRight:'15px'}}>
                <div className="interaction-item"> 
                  <Like
                    postId={post.id}
                    userLikesList={post.user_likes_list}
                    onLikeChange={handleLikeChange}
                  />
                </div>
              
                <div className="interaction-item">
                  <button>
                      <img src={require('../images/comment.png')} alt="Comment"  onClick={() => textareaRef.current && textareaRef.current.focus()}/>
                  </button>
                </div>

                 <Verify 

                    postId={post.id} 
                    userId={userid} 
                    verifyList={post.user_verifies_list}
                    onVerifyChange={handleVerifyChange}/>
                    
            </div>
            <form className='modal-comment-form' onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', width: '35vw', marginTop: '5px', padding:'5px' }}>
        
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleInputChange}
                placeholder="Write a comment..."
                required
                rows={1}
              />
              <button className='modal-comment-submit-button' type="submit" disabled={isLoading} style={{ 
                  alignSelf: 'center', // Align button vertically in the middle
                  height: 'fit-content', 
                  padding: '5px 10px',
                  cursor: 'pointer' // Ensure the cursor changes to pointer on hover over the button
                  }}> Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplaySinglePost
