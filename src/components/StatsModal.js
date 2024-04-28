import React from 'react'

export default function StatsModal({open,children, onClose}) {
  if(!open) return null
  return (
    <div className='overlay-stats-modal' >
        <div className='stats-modal'>
            <button className ='close-button-modal' onClick={onClose}>x</button>
            {children}
        </div>
    </div>
  )
}

