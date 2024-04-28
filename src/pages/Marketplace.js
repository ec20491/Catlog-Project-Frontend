import React,{useState, useEffect} from 'react'
import Header from '../components/Header'
import { jwtDecode } from 'jwt-decode';
import EachItem from '../components/EachItem';
import SearchItemComponent from '../components/SearchItemComponent';

const Marketplace = () => {
  const marketplaceUrl = `http://127.0.0.1:8000/api/items`;
  const [items, setItems] = useState([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  let getitems = () => {
    fetch(marketplaceUrl)
      .then(response => response.json())
      .then(data => {
        setItems(data); // Store the fetched data in state
        console.log(items)
      });
  };

  useEffect(() => {
    getitems();
  }, []); 

  return (
    
    <div>
        <Header/>
        <SearchItemComponent />
        <div className="items" style={{marginTop:'20px'}}>
            {items.map((item, index) => (
                // Use the unique identifier of the item as the key, if available, e.g., item.id
                <div key={item.id || index}>
                    <EachItem individualItem={item} />
                </div>
            ))}
            </div>
      
    </div>
  )
}

export default Marketplace
