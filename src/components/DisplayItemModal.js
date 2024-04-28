import React, {useState, useEffect} from 'react'
import SaveItem from './SaveItem';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import DeleteItem from './DeleteItem';
import MakeOfferModal from  './MakeOfferModal'

export default function DisplayItemModal({open, onClose, individualItem}) {
  
  const [isSaved, setIsSaved] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()
  const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
  };
  const handleUserNavigate = (id) => {
      navigate(`/profile/${id}`);
    };
  const conditionMap = {
      NEW: 'New',
      ULN: 'Used - Like New',
      UG: 'Used - Good'
    };
  //const conditionText = conditionMap[individualItem.condition] || 'Unknown';
    
  const statusMap = {
      AV: 'Available',
      PE: 'Pending',
      SO: 'Sold'
    };
  //const statusText = statusMap[individualItem.status] || 'Unknown';
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
  const handleDeleteComplete = () => {
      setShowDropdown(false);
      console.log('Delete complete');
      // handleUserNavigate(post.author_id)
  };

  if(!open) return null
  return (
    <div className='overlay-display-modal' >
        <div className='display-modal'>
            <button className ='close-button-modal' onClick={onClose}>x</button>
            <div>
            <div className="upload-listing-container">    
                <div className='display-listing-form'>
                    <div className='display-image-modal'>
                        <img src={`http://127.0.0.1:8000${individualItem.media}`} style={{width:'600px', height: '600px'}} alt="Preview"  />
                    </div>

                    <div className="upload-listing-right">
                    <div>
                            <div className='modal-author-desc'>
                        {individualItem.seller.profile_image && (
                        <img className='comment-profile-img' style={{height:'30px', width:'30px', borderRadius:'20px'}} src={`http://127.0.0.1:8000${individualItem.seller.profile_image}`} alt="Profile"
                            onClick={() => handleUserNavigate(individualItem.seller.id)}
                        />
                        )}
                        <strong style={{ marginRight: '8px', cursor:'pointer' }} onClick={() => handleUserNavigate(individualItem.seller.id)}>{individualItem.seller.username}</strong>
                            {individualItem.seller.verified && (
                                <img className='verified-icon-small' src={require('../images/verified.png')} alt="Verified" />
                            )}
                    
                        </div>
                        
                    </div>
                 
                    <div>
                        <label>Title:</label>
                        <input
                            className='listing-title'
                            type="text"
                            readOnly
                            value={individualItem.title}
                        />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                className='listing-desc'
                                type="text"
                                readOnly
                                value={individualItem.description}
                            />
                        </div>
                        <div className='listing-location'>
                            <label>Location:</label>
                            <input
                            className='listing-title'
                            type="text"
                            readOnly
                            value={individualItem.location}
                        />
                        </div>
                        <div className='listing-opt'>
                            <div>
                                <label>Price (£): </label>
                                <input
                                    className='listing-price'
                                    type="text"                                    
                                    value={individualItem.price}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>Status: </label>
                                <input
                                    className='listing-price'
                                    type="text"                                    
                                    value={conditionMap[individualItem.status] || 'Unknown'}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>Condition: </label>
                                <input
                                    className='listing-price'
                                    type="text"                                    
                                    value={conditionMap[individualItem.condition] || 'Unknown'}
                                    readOnly
                                />
                            </div>

                        </div>

                        <div className='interaction' >
                        <div className="interaction-item" onClick={()=>setOfferModalOpen(true)}>
                            <button>
                                <img style={{height:'30px', width:'auto'}} src={require('../images/offer.png')} alt="Comment"  />
                            </button>
                            <button onClick={() => console.log('Reporting post')}>MAKE OFFER</button>
                        </div>
                        <MakeOfferModal itemId={individualItem.id} item={individualItem} open={isOfferModalOpen} onClose={() => setOfferModalOpen(false)} >

                        </MakeOfferModal>

                            <div className="interaction-item">
                                <SaveItem
                                    itemId={individualItem.id}
                                    saveList={individualItem.saves_list}
                                />
                            </div>  
              
                            <div className="interaction-item">
                            <button className='opt-button' onClick={toggleDropdown} >
                                    &#x2630; {/* This is the hamburger menu icon */}
                            </button>
                                {showDropdown && (
                                    <div className="options-dropdown-menu-item">
                                        {individualItem.seller.id === currentUserId ? (
                                            <>
                                            <button onClick={() => navigate(`/edit-item/${individualItem.id}`)}>
                                            Edit Post
                                        </button>
                                            <DeleteItem item={individualItem} onDeleteComplete={handleDeleteComplete} />
                                            </>
                                        ) : (
                                            <button onClick={() => console.log('Reporting post')}>Report post</button>
                                        )}
                                    </div>
                                )}
    
                       
                            </div>

                 

                            
                        </div>
                             
                        
                    
                </div>
                
                </div>
                </div>

            </div>
        </div>
    </div>
  )
}

