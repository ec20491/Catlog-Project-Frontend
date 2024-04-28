import React, { useState } from 'react';

const MakeOfferModal = ({ itemId, item, open, onClose }) => {
    const [offer, setOffer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/create-offer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ item: itemId, offer_amount: parseFloat(offer) })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Offer submitted successfully!');
                setOffer('');
            } else {
                setMessage(data.message || 'Failed to submit offer.');
            }
        } catch (error) {
            setMessage('Network error, please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className='overlay-offer-modal' >
            <div className='offer-modal'>
                <div className="login-form-container" >
                    
                    {/* <h3>Make Offer</h3> */}
                    <form onSubmit={handleSubmit} className='form-inner' style={{padding:'60px 50px'}}>
                        <button className='close-button-modal' onClick={onClose} style={{padding:'5px 20px', display:'flex', justifyContent:'end', alignContent:'flex-end'}}>x</button>
                        <input
                            type="number"
                            value={offer}
                            onChange={(e) => setOffer(e.target.value)}
                            placeholder="Enter your offer amount"
                            min="0.00" // ensuring positive number greater than zero
                            required
                        />
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Offer'}
                        </button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
            </div>
            
        </div>
        
    );
};

export default MakeOfferModal;