import React from 'react'

const NoteSaveExportBtn = ({extraClass, handleClick, children}) => {
  return (
    <button
    onClick={handleClick}
    className={"px-3 py-1 rounded-lg cursor-pointer transition-all duration-300 flex justify-around gap-3 items-center hover:scale-[1.05] max-md:focus:scale-[1.05]"+` ${extraClass}`}>
                {children}
    </button>
  )
}

export default NoteSaveExportBtn
