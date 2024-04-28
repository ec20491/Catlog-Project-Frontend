import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const Header = () => {
    const navigate = useNavigate();
  useEffect(() => {
    // Check if the token exists in local storage and is a string
    const token = localStorage.getItem('token');
    
    if (!token || typeof token !== 'string') {
        // Redirect to login page if token is invalid or not a string
        navigate('/login');
    }
}, [navigate]);
    const userid = jwtDecode(localStorage.getItem('token')).user_id;
    const handleNavigate = (path) => {
        navigate(path);
    };
    const handleUserProfileNavigate = () =>{
        navigate(`/profile/${userid}`);
    }


    const handleLogout = () => { 
        localStorage.removeItem('token')
        navigate('/login');
      }; 
    return (
        <div style={{position:'fixed', width:'100%', top:'0', left:'0', zIndex:'1000'}}>
        <div className='nav' >
            <div className='nav-item' onClick={() => handleNavigate('/dashboard')}>
                <h3 style={{color:'#3b3b3b', fontWeight:'light'}}>ᆞCᆞAᆞTᆞLᆞOᆞGᆞ</h3>
            </div>
            <div className='nav-item'>
                <button onClick={() => handleNavigate('/search')}>
                    <img src={require('../images/search.png')} alt="Search"  />
                    <p>SEARCH</p>
                </button>
            </div>
            <div className='nav-item'>
                <button>
                    <img src={require('../images/market.png')} alt="Marketplace" />
                    <p>MARKETPLACE</p>
                </button>
                <div className="dropdown-content" >
                    <a onClick={() => handleNavigate('/sell-an-item/')}>Create a listing</a>
                    <a onClick={() => handleNavigate('/marketplace/')}>Marketplace</a>
                </div>
            </div>
            {/* <div className='nav-item'  onClick={() => handleNavigate('/dashboard')}>
                <button>
                    <img src={require('../images/home.png')} alt="Home" />
                </button>
            </div> */}
            <div className='nav-item'>
                <button onClick={() => navigate('/upload-post')}>
                    <img src={require('../images/upload.png')} alt="Upload" />
                    <p>UPLOAD</p>
                </button>
            </div>

            <div className='nav-item'>
                <button>
                    <img src={require('../images/user.png')} alt="Profile" />
                    <p>PROFILE</p>
                </button>
                <div className="dropdown-content">
                    <a onClick={() => handleUserProfileNavigate()}>Your Profile</a>
                    <a onClick={() => handleNavigate('/edit-profile/')}>Edit Profile</a>
                    <a onClick={handleLogout}>Logout</a>
                </div>
            </div>

            

        </div>
        </div>
  );
}

export default Header;