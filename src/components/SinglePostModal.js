import React, {useState} from 'react'
import Comments from './Comments'
import SeeMoreText from './SeeMoreText'
import { useNavigate } from 'react-router-dom' 
import Like from './Like'
import Verify from './Verify'
import ShowStats from './ShowStats'
import StatsModal from './StatsModal'
import { jwtDecode } from 'jwt-decode'
import DeletePost from './DeletePost'
import ReportPost from '../components/ReportPost';

const SinglePostModal = ({open, onClose,post, onReplyClick, onDeleteClick , onSubmit, onInputChange, isLoading, text, textareaRef, comments}) => {
    const navigate = useNavigate()
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [likeCount, setLikeCount] = useState(post.total_likes);
    const [verifyCount, setVerifyCount] = useState(post.total_verifies);
    const userid = jwtDecode(localStorage.getItem('token')).user_id;
    const [showDropdown, setShowDropdown] = useState(false);
    const currentUserId = jwtDecode(localStorage.getItem('token')).user_id;
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
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

    if(!open) return null
  return (
    <div className='overlay-display-modal' >
        <div className='display-modal'>
            <button className ='close-button-modal' onClick={onClose}>x</button>
    <div className="post-modal-container">    
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
                  <Comments comment={comment} onReplyClick={onReplyClick} onDeleteClick={onDeleteClick}/>
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
            <form className='modal-comment-form' onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', width: '35vw', marginTop: '5px', padding:'5px' }}>
        
              <textarea
                ref={textareaRef}
                value={text}
                onChange={onInputChange}
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
    </div>
  )
}

export default SinglePostModal
