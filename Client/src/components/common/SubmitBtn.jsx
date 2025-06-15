import React from 'react'

const SubmitBtn = ({ value, classes, disabled}) => {
  return (
    <input 
      type="submit" 
      value={value} 
      className={`h-[45px] w-[140px] font-dongle text-[26px] rounded-full hover:cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-400 max-md:focus:from-blue-400 hover:to-blue-500 max-md:focus:to-blue-500 hover:scale-105 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] max-md:focus:scale-105 max-md:focus:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-300 ease-out ${classes}`} 
      disabled={disabled}
    />
  )
}

export default SubmitBtn