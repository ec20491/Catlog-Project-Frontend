import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const EditPost = () => {
    const [file, setFile] = useState(null);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [imagePreview, setImagePreview] = useState();
    const [text, setText] = useState();
    const textareaRef = useRef(null);
    let isTokenExpired = true;
    const fileInputRef = useRef(null);
    const navigate = useNavigate()
    let decodedToken = null;
    const token = localStorage.getItem('token');
        if (token) {
            decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            if (decodedToken.exp > currentTime) {
                isTokenExpired = false;
            }
        }
    const handleUserNavigate = (postId) => {
          navigate(`/display-post/${postId}`);
        };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isTokenExpired) {
            // If the token is expired or not valid, navigate to login
            console.log('Token is expired or not valid.');
            navigate('/login');
            return; // Exit early to prevent further execution
    }
    const formData = new FormData();
    formData.append('content', text);
    if (file){
        formData.append('media', file)
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/update-post/${postId}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
            handleUserNavigate(post.id)
            
        } else {
          throw new Error('Failed to update the post');
        }
      } catch (error) {
        console.error('Error:', error);
        
      }
    


    

}
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/get-post/${postId}`)
          .then(response => response.json())
          .then(data => {
            setPost(data);
            setImagePreview(`http://127.0.0.1:8000${data.media}`); 
            setText(data.content);
          })
          .catch(err => console.error('Failed to load post', err));
      }, [postId]);  // Dependency array ensures this effect runs only when postId changes

   
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
    <h2 className='page-title'>Edit post</h2>
    <div className="upload-post-container">    
        <div className='upload-post-form'>
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
    );
};

export default EditPost;