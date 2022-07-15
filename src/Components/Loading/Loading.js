import React from 'react'
import { CircularProgress } from '@mui/material'

const Loading = ({ processing, type }) => {
  return (
    <div className='container'>
      <div className='loading'>
        <CircularProgress style={{ color: '#f86060' }} />
        <div className='loading-text'>{processing}%</div>
        <div className='text'>{type}</div>
      </div>
    </div>
  )
}

export default Loading