import React from 'react'

const NoteWritingBtn = ({ children, handleClick, extraClass }) => {
  return (
    <button
    onClick={handleClick}
    className={"px-3 py-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg text-white cursor-pointer transition-all duration-300 flex justify-around gap-3 items-center hover:bg-[rgba(255,255,255,0.15)] hover:scale-[1.05] max-md:focus:bg-[rgba(255,255,255,0.15)] max-md:focus:scale-[1.05]"+` ${extraClass}`}>
                {children}
    </button>
  )
}

export default NoteWritingBtn
