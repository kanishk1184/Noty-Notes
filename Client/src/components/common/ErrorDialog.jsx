import React from 'react'
import { useSelector } from 'react-redux'

const ErrorDialog = () => {
  const text = useSelector(state=>state.ui.error);
  return (
        <>
            <div className='text-sm'>🚩</div>
            <div className='font-medium text-2xl'>{text}</div>
        </>
  )
}

export default ErrorDialog
