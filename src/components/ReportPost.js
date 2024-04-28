import React, { useState } from 'react';

function ReportPost({ onClose, open, postId }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://127.0.0.1:8000/api/report-post/${postId}/`; 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ reason })
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Post reported successfully.');
                setReason(''); // Reset the reason field
            } else {
                throw new Error('Failed to report the post.');
            }
        } catch (error) {
            setMessage(error.message);
        }
    };
    if(!open) return null

    return (

        <div className='overlay-offer-modal' >
            <div className='offer-modal'>
                <div className="login-form-container" >
                    
                    
                    <form onSubmit={handleSubmit} className='form-inner' style={{padding:'40px 50px'}}>
                    <h3>Report Post</h3>
                        <button className='close-button-modal' onClick={onClose} style={{padding:'5px 20px', display:'flex', justifyContent:'end', alignContent:'flex-end'}}>x</button>
                        <input
                            placeholder='Enter your reason here'
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                        <button type="submit">Report</button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
            </div>
            
        </div>
       
    );
}

export default ReportPost;