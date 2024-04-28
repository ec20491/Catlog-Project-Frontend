import React, { useState, useEffect } from 'react';
import Header from './Header';
import SinglePost from '../pages/SinglePost';
import { useNavigate } from 'react-router-dom';
import DisplayPostModal from './DisplayPostModal';

const SearchComponent = () => {
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    const [expandedPostIds, setExpandedPostIds] = useState({}); // This holds IDs of expanded posts

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

    const handleToggle = (id) => {
        setExpandedPostIds(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle true/false based on current state
        }));
    };

    const maxLength = 100;

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSearchSubmitted(true);
        setError('');
    
        try {
            const response = await fetch(`http://localhost:8000/api/search/?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Search failed. Please try again.');
            }
            const data = await response.json();
            setResults(data || []);  // Ensure data.posts is the expected array
            
        } catch (error) {
            setError(error.message);
            setResults([]);  // Ensure this is set to an empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (postId) => {
        setSelectedPostId(postId);
        setIsItemModalOpen(true);
    };

    return (
        <div>
            <Header/>
            <div>
                <h2 className='page-title' style={{marginTop:'120px'}}>Search posts</h2>
                <form style={{marginTop:'5px'}} onSubmit={handleSearch} className='search-form'>
                    <input
                        className='searchBar'
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search posts..."
                    />
                        <button className='submit-search' type="submit">Search</button>
                </form>


            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {!searchSubmitted && ( // Render posts only if search has been submitted
                <div className='posts-page' style={{ marginTop: '80px' }}>
                    {posts.map((post, index) => (
                        <div key={index}>
                            <SinglePost post={post} />
                        </div>
                    ))}
                </div>
            )}
            

            {!loading && results.length > 0 ? (
                <div className='search-output'>
                    <ul>
                    <p style={{textAlign:'center', marginBottom:'30px'}}>------------------------- {results.length} result{results.length !== 1 ? 's' : ''}  found -------------------------</p>
                    <div className='search-output-posts'>
            {results.map(post => (
                <div key={post.id} className="post-item">
                    <img 
                        src={`${post.media}`}
                        onClick={() => handleImageClick(post.id)}
                        alt={`${post.author}'s profile`}
                    />
                    <div className="post-content">
                        <div className="post-title">{post.title}</div>
                        <div>
                            {expandedPostIds[post.id] || post.content.length <= maxLength
                                ? post.content
                                : `${post.content.substring(0, maxLength)}...`}
                            {post.content.length > maxLength && (
                                <span onClick={() => handleToggle(post.id)} className="content-toggle-button">
                                    {expandedPostIds[post.id] ? 'Show Less' : 'Show More'}
                                </span>
                            )}
                        </div>
                            <div className='search-display-stats' >
                                <div className='search-display-stats-inner' >
                                    <p >{post.total_likes}</p>
                                    <img className='verified-icon-small' src={require('../images/heart-filled.png')} alt="Verified Vet Professional" />
                                </div>
                                    
                                    <div className='search-display-stats-inner'>
                                    <p > {post.total_verifies}</p>
                                    <img className='verified-icon-small' src={require('../images/verified.png')} alt="Verified" />
                                </div>
                                
                        </div>
                    </div>
                </div>
            ))}
        </div>

        
                    {selectedPostId && isItemModalOpen && (
                        <DisplayPostModal  
                            open={isItemModalOpen} 
                            onClose={() => {
                                setIsItemModalOpen(false);
                                setSelectedPostId(null); // Reset selectedPostId when modal closes
                            }}
                            postId={selectedPostId}
                        />
                    )}
                    </ul>
                </div>
            ) : !loading && searchSubmitted && results.length === 0 && query && (

                <div className="login-form-container" style={{marginTop:'0'}}>
      
                    <div className="form-inner" style={{marginTop:'0'}}>
                        <form>
                        <p> No results found for "{query}"</p>
                        
                        <button className='no-result-button' style={{borderRadius:'1.625rem', padding:'15px'}} onClick={() => navigate('/upload-post')}>
                                Create post
                        </button>

                        </form>
                    </div>
                </div>
            )}
            </div>
            

            
    </div>
            );
};

export default SearchComponent;