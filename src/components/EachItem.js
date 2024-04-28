import React, {useState, useEffect} from 'react'
import DisplayItemModal from './DisplayItemModal';
import SaveItem from './SaveItem';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import DeleteItem from './DeleteItem';
import MakeOfferModal from  './MakeOfferModal'

const  EachItem = ({individualItem}) => {
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
    const conditionText = conditionMap[individualItem.condition] || 'Unknown';
      
    const statusMap = {
        AV: 'Available',
        PE: 'Pending',
        SO: 'Sold'
      };
      const statusText = statusMap[individualItem.status] || 'Unknown';
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

  return (
    <div>
        <div onClick={()=>setIsItemModalOpen(true)}>
            <div className='item-image'  >
                <img src={`http://127.0.0.1:8000${individualItem.media}`} alt='test' />
            </div>
            <div className='item-desc'>
                <div className='item-desc-inner'>
                    <p>{individualItem.title}</p>
                    <p style={{fontWeight:'bold'}}>£{individualItem.price}</p>
                    <p style={{fontSize:'medium'}}>{individualItem.location}</p>
                </div>
            </div>
        </div>
        <DisplayItemModal open={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} individualItem={individualItem}>
        </DisplayItemModal>
    </div>
  )
}

export default EachItem
