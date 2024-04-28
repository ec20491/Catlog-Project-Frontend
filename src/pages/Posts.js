

  import React, { useEffect, useState } from 'react';
  import SinglePost from './SinglePost';
  import { jwtDecode } from 'jwt-decode';
  import Header from '../components/Header';
  import { useNavigate } from 'react-router-dom';

  function Posts() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('No token found, redirecting to login.');
        navigate('/login', { replace: true });
        return; // Exit early to prevent further execution
      }
  
      let userid;
      try {
        // Decode token to validate it
        const decoded = jwtDecode(token);
        userid = decoded.user_id;
      } catch (error) {
        console.error('Token validation failed:', error);
        navigate('/login', { replace: true });
        return; // Exit early to prevent further execution
      }
  
      const postUrl = `http://127.0.0.1:8000/api/fyp/${userid}`;
  
      // Function to fetch posts, defined inside useEffect to access userid directly
      const getPosts = () => {
        fetch(postUrl)
          .then(response => response.json())
          .then(data => {
            setPosts(data); // Store the fetched data in state
          })
          .catch(error => {
            console.error('Failed to fetch posts:', error);
            // Optional: Handle failed fetch (e.g., redirect, show error message)
          });
      };
  
      getPosts(); // Call to fetch posts after verifying the token and getting user id
    }, [navigate]);
  
    return (
        <div>
          <div>
            <Header/>
          </div>
          <h2 className='page-title' style={{marginTop:'120px'}}>Home page</h2>

          <div className='posts-page' style={{marginTop:'80px'}}>
            {posts.map((post, index) => (
                <div key={index}>
                    <SinglePost post={post}/>
                </div>
            ))}
          </div>

        </div>
    );
  }
  
  export default Posts;