import React,{useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import SinglePost from './SinglePost';
import EachItem from '../components/EachItem';

const UserProfile = () => {
  const { userId } = useParams();
  const currentUserId = jwtDecode(localStorage.getItem('token')).user_id;
  const [isFollowing, setIsFollowing] = useState(false); // Initial state based on whether the user is already followed
  const navigate = useNavigate();
  const [isPostModalOpen,setIsPostModalOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('posts');

  const handleMenuChange = (menu) => {
      setActiveMenu(menu);
  };
  
  
  // Create a state to store the projects data
  const [userProfile, setUserProfile] = useState([]);
  const [followerCount, setFollowerCount] = useState();
  
  
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


    const toggleFollow = async (userId) => {
        const response = await fetch(`http://127.0.0.1:8000/api/follow/${userId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            // setUserProfile(data);
            setIsFollowing(!isFollowing);
            if (data.status === 'following') {
              setFollowerCount(followerCount+1)
            }
            else{
              setFollowerCount(followerCount-1)
            }

        }
    };

  const handleEditProfileClick = () => { 
    navigate('/edit-profile'); 
  };  
 

  const postsContent = userProfile.posts ? (
    userProfile.posts
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sorting by updated date in descending order
        .map(post => (
            <div key={post.id}>
                <img 
                    src={`http://127.0.0.1:8000${post.media}`}
                    onClick={() => navigate(`/display-post/${post.id}`)} // Navigate on click
                    alt={`${post.author}'s profile`} 
                />
            </div>
        ))
) : (
    <p>No posts available.</p>
);
  
  const listings = userProfile.items_list ? (
  userProfile.items_list.map(listing => (
    <div key={listing.id}>
        <EachItem individualItem={listing} />
    </div>
 
  ))
) : (
  <p>No listings yet.</p>
);

  const saves = userProfile.saves_list ? (
    userProfile.saves_list.map(save => (
      <div key={save.id}>
        <EachItem individualItem={save.item} />
      </div>
    ))
  ) : (
    <p>No saved listings yet.</p>
  );




  useEffect(() => {
    if (isTokenExpired) {
      // If the token is expired or not valid, navigate to login
      console.log('Token is expired or not valid.');
      navigate('/login');
      return; // Exit early to prevent further execution
    }
    const userProfileUrl = `http://127.0.0.1:8000/api/users/${userId || currentUserId}`;
    console.log(userProfileUrl);

    const getUserProfile = async () => {
      const response = await fetch(userProfileUrl);
      const data = await response.json();
      if (response.ok) {
        setUserProfile(data);
        const isCurrentUserFollowing = data.followers.some(follower => follower.userId === currentUserId);
        setIsFollowing(isCurrentUserFollowing);
        setFollowerCount(data.num_followers)
      }
    };

    getUserProfile();
  }, [userId, navigate, currentUserId]); 


  return (
    <div>
      <Header/>
      <div className="profile-container" style={{marginTop:'120px'}}>

        <div className="profile-header" >
          <img className="profile-image" src={`http://127.0.0.1:8000${userProfile.profile_image}`} alt="Profile Image" />

          <div className='profile-header-right'>
            <div className='profile-header-right-1'>
              <h2>{userProfile.username}</h2>
              {userProfile.vet_professional && userProfile.vet_professional_info?.verified && (
                  <img className='verified-icon' src={require('../images/verified.png')} alt="Verified Vet Professional" />
              )}

              {parseInt(userId) === currentUserId ? (
                <button className="edit-profile-btn" onClick={handleEditProfileClick}>
                  Edit Profile
                </button>
              ) : (
                <button 
                    className={`follow-btn ${isFollowing ? 'following' : 'follow'}`} 
                    onClick={() => toggleFollow(userId)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
              )}

            </div>
            <p>{userProfile.bio}</p>
          </div>
        </div>
        <div>
        {userProfile.vet_professional && userProfile.vet_professional_info?.verified && (
              <div className='additional-profile-info'>
                <div className='additional-row'>
                  <p> Reference Number: {userProfile.vet_professional_info.reference_number}</p>
                  <p> Registration date: {userProfile.vet_professional_info.registration_date}</p>
                </div>
                
                <div className='additional-row'>
                  <p> Location: {userProfile.vet_professional_info.location}</p>
                  <p>Field of work: {userProfile.vet_professional_info.field_of_work}</p>
                </div>
              </div>
        )}

        </div>

          <div className="profile-stats">
              <div>
                  <h3>Followers</h3>
                  <p>{followerCount}</p>
              </div>
              <div>
                  <h3>Following</h3>
                  <p>{userProfile.num_following}</p>
              </div>
              <div>
                  <h3>Posts</h3>
                  <p>{userProfile.num_posts}</p>
              </div>
          </div>
          
          
        <div>
        
          {/* <div className="posts">
            {saves}
          </div> */}
          <div className="profile-menu">
            <div className={`button ${activeMenu === 'posts' ? 'active-menu-item' : 'menu-item'}`}>
              <div  
                      className={`button ${activeMenu === 'posts' ? 'active-menu' : 'inactive-menu'}`}
                      onClick={() => handleMenuChange('posts')}
                  >
                      <img className={`button ${activeMenu === 'posts' ? 'active-menu' : 'inactive-menu'}`} src={require('../images/pixels.png')} alt="Comment"/>
                      <p>POSTS</p>
                      
              </div>
            </div>
            <div className={`button ${activeMenu === 'listings' ? 'active-menu-item' : 'menu-item'}`}>
              <div  
                      className={`button ${activeMenu === 'listings' ? 'active-menu' : 'inactive-menu'}`}
                      onClick={() => handleMenuChange('listings')}
                  >
                      <img className={`button ${activeMenu === 'listings' ? 'active-menu' : 'inactive-menu'}`} src={require('../images/market.png')} alt="Comment"/>
                      <p>MARKETPLACE</p>
                      
              </div>
            </div>
            <div className={`button ${activeMenu === 'saves' ? 'active-menu-item' : 'menu-item'}`}>
              <div  
                      className={`button ${activeMenu === 'saves' ? 'active-menu' : 'inactive-menu'}`}
                      onClick={() => handleMenuChange('saves')}
                  >
                      <img className={`button ${activeMenu === 'saves' ? 'active-menu' : 'inactive-menu'}`} src={require('../images/pixels.png')} alt="Comment"/>
                      <p>SAVED</p>
                      
              </div>
            </div>
                
                
                
            </div>
            <div className="content">
                {activeMenu === 'posts' && <div className="posts">{postsContent}</div>}
                {activeMenu === 'listings' && <div className="posts">{listings}</div>}
                {activeMenu === 'saves' && <div className="posts">{saves}</div>}
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile
