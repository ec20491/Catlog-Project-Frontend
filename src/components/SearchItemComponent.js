import React, { useState, useEffect } from 'react';
import Header from './Header';
import SinglePost from '../pages/SinglePost';
import { useNavigate } from 'react-router-dom';
import DisplayPostModal from './DisplayPostModal';
import DisplayItemModal from './DisplayItemModal';
const SearchItemComponent = () => {
    const navigate = useNavigate()
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [item, setItem] = useState([]);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSearchSubmitted(true);
        setError('');
    
        try {
            const response = await fetch(`http://localhost:8000/api/search-item/?query=${encodeURIComponent(query)}`);
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

    const handleImageClick = (itemId, item) => {
        setItem(item)
        setSelectedItemId(itemId);
        setIsItemModalOpen(true);
    };

    return (
        <div>
            <Header/>
            <div>
                <h2 className='page-title' style={{marginTop:'120px'}}>Search marketplace</h2>
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

            {!loading && results.length > 0 ? (
                <div className='search-output'>
                    <ul>
                    <p style={{textAlign:'center', marginBottom:'30px'}}>------------------------- {results.length} result{results.length !== 1 ? 's' : ''}  found -------------------------</p>
                    <div className='search-output-items'>
                        {results.map(item => (
                            <img 
                            key={item.id}
                            // onClick={()=>setIsItemModalOpen(true)}
                            src={`http://127.0.0.1:8000${item.media}`}
                            onClick={() => handleImageClick(item.id, item)}
                            alt={`${item.author}'s profile`} 
                        />
                        ))}                    
                    </div>
                    
                    </ul>
                    {selectedItemId && isItemModalOpen && (
                        <DisplayItemModal  
                            open={isItemModalOpen} 
                            onClose={() => {
                                setIsItemModalOpen(false);
                                setSelectedItemId(null);  
                                setItem(null) 
                            }}
                            individualItem={item}
                            // postId={selectedItemId}
                        ></DisplayItemModal>
                    )}
                </div>
            ) : !loading && searchSubmitted && results.length === 0 && query && (

                <div className="login-form-container" style={{marginTop:'0'}}>
      
                    <div className="form-inner" style={{marginTop:'0'}}>
                        <form>
                        <p> No results found for "{query}"</p>
                        
                        <button className='no-result-button' style={{borderRadius:'1.625rem', padding:'15px'}} onClick={() => navigate('/sell-an-item/')}>
                                Create item
                        </button>

                        </form>
                    </div>
                </div>
            )}
            </div>
            

            
    </div>
            );
};

export default SearchItemComponent;