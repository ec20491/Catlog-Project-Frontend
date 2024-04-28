import React,{useState,useEffect, useRef} from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AutoSearchGoogle from '../components/AutoSearchGoogle';
const CreateListing = () => {
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    const handleAddressChange = (newAddress) => {
        setAddress(newAddress);
        
    };

    const handleCoordinatesChange = (newCoordinates) => {
        setCoordinates(newCoordinates);
        
    };

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

  useEffect(() =>{
    if (isTokenExpired) {
        navigate('/login');
        return; // Exit early to prevent further execution
    }
  })

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('AV'); // Default to 'AVAILABLE'
  const [condition, setCondition] = useState('NEW'); // Default to 'NEW'
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const handleCancel = () => {
    navigate(-1); // Adjust the path as needed for your application
};
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('status', status);
    formData.append('condition', condition);
    formData.append('location',address)
    formData.append('latitude',coordinates.lat)
    formData.append('longitude', coordinates.lng)
    if (file) {
        console.log("media")
      formData.append('media', file);
    }

    
    // Replace with your API endpoint
    const response = await fetch('http://127.0.0.1:8000/api/create-listing/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
      body: formData,
      
    });

    if (response.ok) {
      navigate('/marketplace/')
    } else {
      // Handle failure scenario
      alert('Failed to upload item');
    }
  };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        setFile(file);
        setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
        setFile(file);
        setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleClick = () => {
        fileInputRef.current.click(); // Triggers the file input dialog
    };
  return (
    <div>
        <Header/>
        <div>
        <h2 className='page-title' style={{marginTop:'120px'}}>Create a listing</h2>
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
                                 onAddressChange={handleAddressChange} 
                                 onCoordinatesChange={handleCoordinatesChange}
                            />
                        </div>
                        <div className='listing-opt'>
                            <div>
                                <label>Price (£): </label>
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
  )
}

export default CreateListing
