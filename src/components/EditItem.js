import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AutoSearchGoogle from './AutoSearchGoogle';

const EditItem = () => {
    const [file, setFile] = useState(null);
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState();
    const [price, setPrice] = useState('');
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [status, setStatus] = useState('AVAILABLE');
    const [condition, setCondition] = useState('NEW');
    const [text, setText] = useState();
    const textareaRef = useRef(null);
    let isTokenExpired = true;
    const fileInputRef = useRef(null);
    const navigate = useNavigate()
    let decodedToken = null;
    const token = localStorage.getItem('token');

        const handleAddressChange = (newAddress) => {
            setAddress(newAddress);
            
        };
    
        const handleCoordinatesChange = (newCoordinates) => {
            setCoordinates(newCoordinates);
            
        };
    const handleUserNavigate = (postId) => {
          navigate(`/display-post/${postId}`);
        };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('status', status);
        formData.append('condition', condition);
        formData.append('address', address);
        formData.append('lat', coordinates.lat);  // Assuming you want to send these
        formData.append('lng', coordinates.lng);
        formData.append('content', text);  // Check if this is relevant
        if (file) {
            formData.append('media', file);
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update-item/${itemId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Update successful");
                // navigate(`/display-item/${itemId}`); // Redirect to the item detail page or similar
            } else {
                throw new Error('Failed to update the item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to update the item due to an error."); // Displaying error message to the user
        }
    
}
    
useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/get-item/${itemId}`);
            const data = await response.json();
            if (response.ok) {
                setItem(data);
                setTitle(data.title);
                setDescription(data.description);
                setPrice(data.price);
                setAddress(data.address);
                setStatus(data.status);
                setCondition(data.condition);
                setImagePreview(`http://127.0.0.1:8000${data.media}`);
            } else {
                throw new Error('Failed to load item');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    fetchData();
}, [itemId]);
   
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          setFile(file);
          setImagePreview(URL.createObjectURL(file));
        }
      };

      const handleCancel = () => {
        navigate(-1); // Adjust the path as needed for your application
    };
    const handleClick = () => {
        fileInputRef.current.click(); // Triggers the file input dialog
      };
    
      const handleCaptionChange = (e) => {
        setText(e.target.value);
      };
    
      const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  
    };

    return (
        <div>
        <Header/>
        <div>
        <h2 className='page-title' style={{marginTop:'80px'}}>Edit listing</h2>
        <div className="upload-listing-container">    
            <div className='upload-listing-form'>
                <div
                className='drop-zone'
                onClick={handleClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                >
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '410px', height: '410px' , borderRadius: '20px'}} />
                ) : (
                    <img src={require('../images/plus.png')} alt="Add"  />
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                </div>

                
                <div className="upload-listing-right">
                    <div>
                        <label>Title:</label>
                        <input
                            className='listing-title'
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                className='listing-desc'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className='listing-location'>
                            <label>Location:</label>
                            <AutoSearchGoogle 
                                 existAddress={address}
                                 onAddressChange={handleAddressChange} 
                                 onCoordinatesChange={handleCoordinatesChange}
                            />
                        </div>
                        <div className='listing-opt'>
                            <div>
                                <label>Price: </label>
                                <input
                                    className='listing-price'
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Status: </label>
                                <select  className='listing-status' value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="AV">Available</option>
                                    <option value="PE">Pending</option>
                                    <option value="SO">Sold</option>
                                </select>
                            </div>
                            <div>
                                <label>Condition: </label>
                                <select className='listing-cond' value={condition} onChange={(e) => setCondition(e.target.value)}>
                                    <option value="NEW">New</option>
                                    <option value="ULN">Used - Like New</option>
                                    <option value="UG">Used - Good</option>
                                </select>
                            </div>
                        </div>
                        
                        
                    <div className="form-buttons">
                    <button type="button" onClick={handleCancel} style={{ marginRight: '10px' }}>
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit}>
                        Share
                    </button>
                    </div>
                </div>
                
            </div>
        </div>
        </div>
    </div>
    );
};

export default EditItem;