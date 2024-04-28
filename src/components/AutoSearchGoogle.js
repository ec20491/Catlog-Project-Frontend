import React,{useState} from 'react'
import PlacesAutocomplete, {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
  } from 'react-places-autocomplete';

function AutoSearchGoogle({existAddress,onAddressChange, onCoordinatesChange }) {
    const [address, setAddress]= useState(existAddress || '');
    const [coordinates, setCoordinates] = useState({
        lat:null,
        lng: null
    })
    const handleSelect = async value =>{
        const result = await geocodeByAddress(value);
        const ll = await getLatLng(result[0]);
        // console.log(ll)
        setAddress(value)
        setCoordinates(ll)
        onAddressChange(value);  
        onCoordinatesChange(ll);    
    }

  return (
    <div>
        {/* <p>lat: {coordinates.lat}</p>
        <p>long: {coordinates.lng}</p>
        <p>address: {address}</p> */}
    <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
            
              {...getInputProps({
                placeholder: 'Search town or city',
                
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                return (
                  <div
                    key={suggestion.placeId}
                    {...getSuggestionItemProps(suggestion, {
                      className
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      </div>
  )
}

export default AutoSearchGoogle
