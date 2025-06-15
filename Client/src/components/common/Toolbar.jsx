import React from 'react'

const Toolbar = ({ children }) => {
  return (
    <div className='backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] border rounded-full text-white bg-[rgba(255,255,255,0.15)] flex text-center items-center justify-center relative'>
        {children}
    </div>
  )
}

export default Toolbar
