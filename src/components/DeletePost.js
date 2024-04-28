import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const DeletePost = ({ post, onDeleteComplete }) => {
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

    const handleDelete = async () => {
        if (isTokenExpired) {
            // If the token is expired or not valid, navigate to login
            console.log('Token is expired or not valid.');
            navigate('/login');
            return; // Exit early to prevent further execution
        }
        const currentUserId = jwtDecode(localStorage.getItem('token')).user_id;
        if (currentUserId != post.author_id){
            alert("Not allowed")
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete-post/${post.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you are using JWT for authentication
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete the post');
            }
            onDeleteComplete(true, 'Post deleted successfully'); // Pass success status and message to parent
        } catch (error) {
            console.error(error);
            onDeleteComplete(false, error.message); // Pass failure status and error message to parent
        }
        
        onDeleteComplete();  // Callback to notify the parent component that deletion is complete
    };

    return <button onClick={handleDelete}>Delete Post</button>;
};

export default DeletePost;