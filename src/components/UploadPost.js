import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { jwtDecode } from 'jwt-decode';

const UploadPost = () => {
  const allowedImageTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
    const handleUserNavigate = (authorId) => {
        navigate(`/profile/${authorId}`);
      };
  const handleCancel = () => {
    navigate(-1); // Adjust the path as needed for your application
};
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set to scroll height
    }
  }, [text]); 

  useEffect(() =>{
    if (isTokenExpired) {

        // If the token is expired or not valid, navigate to login
        console.log('Token is expired or not valid.');
        navigate('/login');
        return; // Exit early to prevent further execution
    }
  })

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file type is included in the allowedImageTypes array
      if (allowedImageTypes.includes(file.type)) {
          setFile(file);
          setImagePreview(URL.createObjectURL(file));
          setErrorMessage('');  // Clear any existing errors
      } else {
          setErrorMessage('Only specific image files are allowed (JPEG, PNG, GIF, WEBP).');
          setFile(null);
          setImagePreview('');
      }
  }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];

    if (file) {
        // Check if the file type is included in the allowedImageTypes array
        if (allowedImageTypes.includes(file.type)) {
            setFile(file);
            setImagePreview(URL.createObjectURL(file));
            setErrorMessage('');  // Clear any existing errors
        } else {
            setErrorMessage('Only specific image files are allowed (JPEG, PNG, GIF, WEBP).');
            setFile(null);
            setImagePreview('');
        }
    }
};

  const handleClick = () => {
    fileInputRef.current.click(); // Triggers the file input dialog
  };

  const handleCaptionChange = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isTokenExpired) {
        // If the token is expired or not valid, navigate to login
        console.log('Token is expired or not valid.');
        navigate('/login');
        return; // Exit early to prevent further execution
    }
    
    // Create FormData to send files and text
    const formData = new FormData();
    formData.append('title', title)
    formData.append('media', file);
    formData.append('content', text);
   
    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload/', {
          method: 'POST',
          headers: {
              // No 'Content-Type' header: let the browser set it with the correct boundary for FormData
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
      });

      if (response.ok) {
          // Parse the JSON response and then navigate
          const data = await response.json();
          console.log('Upload Successful:', data);
          handleUserNavigate(jwtDecode(localStorage.getItem('token')).user_id);
      } else {
          // Handle non-200 HTTP responses
          const errorData = await response.json(); // Assuming that the server responds with JSON on errors
          console.error('Upload failed:', errorData.errors.content);
          setErrorMessage(errorData.errors.content)

          // Optionally show an error message to the user
      }
  } catch (error) {
      // Handle network errors or issues with the fetch operation itself
      console.error('Network error or fetch operation failed:', error);
  }
  };

  return (
   <div>
    <Header/>
    <h2 className='page-title' style={{marginTop:'120px'}}>Create new post</h2>
    
    <div className="upload-post-container" >    
    
        <div className='upload-post-form' style={{flexDirection:'column'}}>
            <div style={{display:'1', justifyContent:'center', alignContent:'center', textAlign:'center'}}>
              {errorMessage && <p className="error-message" >{errorMessage}</p>}
            </div>
         
        <div style={{display:'flex', gap:'30px'}}>
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

            {imagePreview && (
            <div className="upload-form-right">
                                <textarea
                                    placeholder="Title"
                                    className='title'
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                <textarea
                ref={textareaRef}
                value={text}
                onChange={handleCaptionChange}
                placeholder="Write a caption..."
                style={{
                    flexGrow: 1,
                    resize: 'none',
                    minHeight: '20px',
                    lineHeight: '24px',
                    width: '400px',
                }}
                />
                <div className="form-buttons">
                <button type="button" onClick={handleCancel} style={{ marginRight: '10px' }}>
                    Cancel
                </button>
                <button type="submit" onClick={handleSubmit}>
                    Share
                </button>
                </div>
            </div>
            )}
        </div>
            
        </div>
        </div>
    </div>
  );
};

export default UploadPost;
