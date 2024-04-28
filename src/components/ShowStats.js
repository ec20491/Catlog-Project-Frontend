import React from 'react'
import { useNavigate } from 'react-router-dom';

const ShowStats = ({list}) => {
    const navigate = useNavigate()
    const handleUserNavigate = (authorId) => {
        navigate(`/profile/${authorId}`);
      };
  return (
    <div>
      {list.map(user => (
                  <div key={user.id} className='modal-stats-item' style={{ display: 'flex', alignItems: 'center' }}>
                  
                    <img src={`http://127.0.0.1:8000${user.profile_image}`} 
                    alt="Profile" className='modal-stats-img'
                    onClick={() => handleUserNavigate(user.id)}
                    />
                  <h4 className='modal-stats-name' onClick={() => handleUserNavigate(user.id)}>{user.username}</h4>
                  {user.verified && (
                      <img className='verified-icon-small' style={{marginLeft:'5px'}} src={require('../images/verified.png')} alt="Verified Vet Professional" />

                  )}
                </div>
                ))}
    </div>
  )
}

export default ShowStats
