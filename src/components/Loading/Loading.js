import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Loading.css';
function Loading() {
  return (
    <div className="loading-overlay">
      <FontAwesomeIcon icon={faSpinner} className="loading-icon" />
    </div>
  )
}

export default Loading