import React,{useState, useEffect} from 'react'
import { jwtDecode } from 'jwt-decode';


const SaveItem = ({itemId, saveList}) => {
    const userid = jwtDecode(localStorage.getItem('token')).user_id;
    const [isSaved, setIsSaved] = useState(false);
    const toggleSaveUrl = `http://127.0.0.1:8000/api/toggle-save/${itemId}/`;
    useEffect(() => {
        // First, ensure that saveList is an array and userid is defined.
        if (Array.isArray(saveList) && userid) {
          // Use the some() method to check if the current user has saved any posts.
          const isSavedByCurrentUser = saveList.some(save => save.id === userid);
          setIsSaved(isSavedByCurrentUser);
        } else {
          // If saveList is not an array or is empty, set isSaved to false.
          // This also covers the scenario when saveList is empty since some() on an empty array returns false.
          setIsSaved(false);
        }
      }, [saveList, userid]);

  const handleSaveClick = async () => {
    try {
        const response = await fetch(toggleSaveUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setIsSaved(isSaved => ! isSaved);
            if (data.action === 'saved') {
              console.log('item is saved')
            }
            else if (data.action === 'unsaved'){
                console.log('item is unsaved')
            }
            

        } else {
            console.error('Failed to toggle save status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  const icon = isSaved
    ? require('../images/saved.png') 
    : require('../images/unsaved.png');

  return (
    <div style={{display:'flex', gap:'5px', flexDirection:'row'}}>
        <button className='save-button' onClick={handleSaveClick}>
            <img style={{width:'25px', height:'auto'}} className='save-button-img' src={icon} alt={isSaved ? "Unsaved" : "Saved"} />

        </button>
        <p>SAVE</p>
     
      
    </div>
  )
}

export default SaveItem
