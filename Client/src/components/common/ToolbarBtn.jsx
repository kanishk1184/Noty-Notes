import React from 'react'

const ToolbarBtn = ({children, handleClick, extraClass, title}) => {
  return (
    <button className={`px-2 py-2 hover:bg-[rgba(255,255,255,0.2)] max-md:focus:bg-[rgba(255,255,255,0.2)] transition-all duration-300 ease-out cursor-pointer ${extraClass}`} onClick={handleClick} title={title}>
        {children}
    </button>
  )
}

export default ToolbarBtn
