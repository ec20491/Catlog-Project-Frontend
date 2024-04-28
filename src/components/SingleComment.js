import React from 'react'

const SingleComment = (reply) => {
    console.log(reply.comment.author)
  return (
    <div style={{ marginLeft: '20px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {reply.comment.author.profile_image && (
            <img src={`http://127.0.0.1:8000${reply.comment.author.profile_image}`} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '15px', marginRight: '10px' }} />
        )}
        <h4 style={{ margin: '0' }}>{reply.comment.author.username}</h4>
        </div>
        <p>{reply.comment.text}</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>Posted: {new Date(reply.comment.created_at).toLocaleString()}</p>
    </div>

    
  )
}

export default SingleComment
