import React from 'react'
import './index.css'

import notFoundImg from '../../imgs/notfound.avif'

const NotFound = () => (
  <div className="container text-center">
    <img
      src={notFoundImg}
      alt="not-found"
      className="w-50"
    />
  </div>
)

export default NotFound