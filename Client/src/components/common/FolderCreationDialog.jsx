import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSidebar, toggleFolderCreate } from '../../features/ui-ux/uiSlice';
import { v4 as uuid } from 'uuid';
import { addFolder, deleteFolder, setCurrFolder, updateFolderId } from '../../features/folders/folderSlice';
import { setError } from '../../features/ui-ux/uiSlice';
import API from '../../axios';

const FolderCreationDialog = () => {
    const [folderName, setFolderName] = useState("");
    const folders = useSelector(state=>state.folders.folders);
    const dispatch = useDispatch();
    
    const handleOk = async () => {
      const _id = uuid();
        try{
          // Create a folder with tempID
          const newFolder = {
            _id,
            name: folderName,
          }
          dispatch(addFolder(newFolder));
          
          // Call axios 
          const res = await API.post('/folder/create-or-update', {newName: folderName});
          if (!folders.length) dispatch(setCurrFolder({name: folderName, _id: res.data._id}));
          dispatch(updateFolderId({_id: res.data._id, name: folderName}));
        }
        catch (err){
          const errorMsg = err.response ? err.response.data.message: "Something went Wrong!";
          dispatch(setError(errorMsg));

          // Delete the created newFolder
          dispatch(deleteFolder(_id));
        }
        dispatch(toggleFolderCreate());
        dispatch(setSidebar(false));
    }
    const handleCancel = () => {
        dispatch(toggleFolderCreate());
    }
    const handleKeyDown = e =>{
      if (e.key === 'Enter' && folderName.trim() !== '') handleOk();
      else if (e.key === 'Escape') handleCancel();
    }
    
  return (
    <div className='w-[300px] h-[150px] lg:scale-[1.4] bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border rounded-2xl border-[rgba(255,255,255,0.1)] flex flex-col justify-around p-3 text-white transition-all'>
      <div className="text-2xl">So what's the name?</div>
      <input type="text" className='text-xl border border-[rgba(255,255,255,0.1)] px-2 rounded-lg py-1 focus:outline-none focus:placeholder:text-sm placeholder:transition-all' placeholder='New Folder Name' value={folderName} onChange={e=>setFolderName(e.target.value)} onKeyDown={handleKeyDown} autoFocus/>
      <div className='flex gap-2 justify-end text-xl'>
        <button className='hover:cursor-pointer hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] px-3 h-[32px] rounded-md transition-all duration-300 ease-out text-red-400' onClick={handleCancel}>Cancel</button>
        <button className={`px-3 h-[32px] rounded-md transition-all duration-300 ease-out ${folderName.trim() ? 'text-green-400 hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] cursor-pointer': 'text-[rgba(255,255,255,0.3)] cursor-not-allowed'}`} onClick={handleOk} disabled={!folderName.trim()}>Ok</button>
      </div>
    </div>
  )
}

export default FolderCreationDialog
