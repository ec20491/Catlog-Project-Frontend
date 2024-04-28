import React,{useState} from "react";
const SeeMoreText = ({ text = '', maxLength }) => { // Provide a default empty string if text is undefined
  const [showFullText, setShowFullText] = useState(false);
  const textIsLong = text.length > maxLength;

  const toggleText = () => setShowFullText(!showFullText);

  return (
    <>
      {textIsLong ? (
        <p style={{ margin: '0', flex: 1, wordWrap: 'break-word', overflow: 'auto' }}>
          {showFullText ? text : `${text.substring(0, maxLength)}...`}
          <button onClick={toggleText} style={{  border: 'none', background: 'none', color: '#666', cursor: 'pointer' }}>
            {showFullText ? 'See Less' : 'See More'}
          </button>
        </p>
      ) : (
        <p style={{ margin: '0', flex: 1, wordWrap: 'break-word', overflow: 'auto' }}>{text}</p>
      )}
    </>
  );
};

export default SeeMoreText;