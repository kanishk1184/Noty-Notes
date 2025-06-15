import React, { useEffect } from 'react'
import API from '../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NoteDeletionDialog = ({ isDeleting, setIsDeleting }) => {
  const currNote = useSelector(state=>state.notes.currNote);
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleOk = async ()=>{
        setIsDeleting(false);
        // Delete the current note
        try{
          const res = await API.delete("/note/delete", {data: {noteId: currNote._id}});

          // Delete from the redux state (No need as opening dashboard always call backend for notes first)
          // dispatch(deleteNote(currNote._id));
          navigate('/');
        }
        catch (err) { 
          const errorMsg = err.response ? err.response.data.message : "Can't Delete, Please Try Again";
          dispatch(setError(errorMsg));
        }

    }
    const handleCancel = ()=>{
        setIsDeleting(false);
    }
    const handleKeyDown = e =>{
      if (e.key === 'Enter') handleOk();
      else if (e.key === 'Escape') handleCancel();
    }
    useEffect(()=>{
        window.addEventListener('keydown', handleKeyDown);

        return ()=>{window.removeEventListener('keydown', handleKeyDown)}
    }, [])
    
  return (
    <div className='w-[300px] h-[150px] lg:scale-[1.4] bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border rounded-2xl border-[rgba(255,255,255,0.1)] flex flex-col justify-around items-center text-white transition-all py-5'>
      <div className="text-2xl">Do you really wanna delete?</div>
      <div className='flex gap-2 justify-end text-xl'>
        <button className='hover:cursor-pointer hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] px-3 h-[32px] rounded-md transition-all duration-300 ease-out text-green-400' onClick={handleCancel}>NOOO</button>
        <button className={`px-3 h-[32px] rounded-md transition-all duration-300 ease-out text-red-400 hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] cursor-pointer`} onClick={handleOk}>YESS</button>
      </div>
    </div>
  )
}

export default NoteDeletionDialog
