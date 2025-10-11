import React from 'react'
import { Link } from 'react-router-dom'

const TestPage = () => {
  return (
    <div className='TestPage'>
      <h2 className='center pt-20'>Choose what you want to do</h2>
        <div className='link'>
          <div><Link to='/'>View Friends</Link></div>
          <div><Link to='/#add-friend'>Add Friend</Link></div>
        </div>
    </div>
  )
}

export default TestPage