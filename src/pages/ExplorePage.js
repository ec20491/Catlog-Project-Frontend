import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SinglePost from './SinglePost'
import { useNavigate } from 'react-router-dom';

const ExplorePage = () => {
      const navigate = useNavigate();
      useEffect(() => {
        // Check if the token exists in local storage and is a string
        const token = localStorage.getItem('token');
        
        if (!token || typeof token !== 'string') {
            // Redirect to login page if token is invalid or not a string
            navigate('/login');
        }
    }, [navigate]);
    const postUrl = `http://127.0.0.1:8000/api/explore/`;
  
    // Create a state to store the projects data
    const [posts, setPost] = useState([]);
  
    let getPosts = () => {
      fetch(postUrl)
        .then(response => response.json())
        .then(data => {
          setPost(data); // Store the fetched data in state
        });
    };
  
    useEffect(() => {
      getPosts();
    }, []); 
  
  return (
    <div>
          <div>
            <Header/>
          </div>

          <h2 className='page-title' style={{marginTop:'100px'}}>Explore page</h2>

          <div className='posts-page' style={{marginTop:'80px'}}>
            {posts.map((post, index) => (
                <div key={index} >
                    <SinglePost post={post}/>
                </div>
            ))}
          </div>

        </div>
  )
}

export default ExplorePage
