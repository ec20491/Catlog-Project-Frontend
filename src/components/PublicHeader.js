import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const PublicHeader = () => {
    

    return (
        <div className='public-nav' >
            <div className='public-nav-item' style={{padding:'30px'}}>
                <h3 style={{color:'#3b3b3b', fontWeight:'light', fontSize:'30px'}}>ᆞᆞCᆞᆞAᆞᆞTᆞᆞLᆞᆞOᆞᆞGᆞᆞ</h3>
            </div>
            {/* <div className='nav-item'>
                <button >
                    <img src={require('../images/search.png')} alt="Search"  />
                </button>
            </div> */}
        
            {/* <div className='nav-item'  >
                <button>
                    <img src={require('../images/home.png')} alt="Home" />
                </button>
            </div>
            <div className='nav-item'>
                <button >
                    <img src={require('../images/upload.png')} alt="Upload" />
                </button>
            </div> */}


            

        </div>
  );
}

export default PublicHeader;