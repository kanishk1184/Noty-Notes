import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash, FiMoreVertical, FiCheck, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from 'framer-motion';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFolderCreate, toggleSidebar } from '../../features/ui-ux/uiSlice';
import { deleteFolder, updateFolderName, setCurrFolder, addFolderAtIdx } from '../../features/folders/folderSlice';
import { setError } from '../../features/ui-ux/uiSlice';
import API from '../../axios';

const Sidebar = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [currRenameFolderId, setCurrRenameFolderId] = useState(null);
  const inputRef = useRef(null);
  const isMobile = useSelector(state => state.ui.isMobile);
  const currFolder = useSelector(state => state.folders.currFolder);
  const folders = useSelector(state => state.folders.folders);
  const dispatch = useDispatch();

  // Focus input when rename mode starts
  useEffect(() => {
    if (currRenameFolderId && inputRef.current) {
      inputRef.current.select();
    }
  }, [currRenameFolderId]);

  const handleHamburgerClick = () => {
    dispatch(toggleSidebar());
  }

  const toggleMenu = (folderId) => {
    setOpenMenuId(openMenuId === folderId ? null : folderId);
  };

  const handleEdit = (folderId, currentName) => {
    setOpenMenuId(null);
    setCurrRenameFolderId(folderId);
    setRenameValue(currentName);
  }

  const handleRenameSubmit = (folderId, prevName) => {
    if (renameValue.trim() && renameValue.trim() !== '') {
      onFolderRename(folderId, renameValue.trim(), prevName);
      setCurrRenameFolderId(null);
      setRenameValue('');
    }
  };

  const onFolderRename = async (folderId, newName, prevName) => {
    try {
      dispatch(updateFolderName({ _id: folderId, name: newName }));

      // Call axios
      const res = await API.post('/folder/create-or-update', { _id: folderId, newName });
    }
    catch (err) {
      const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
      dispatch(setError(errorMsg));
      dispatch(updateFolderName({ _id: folderId, name: prevName }));
    }
  }

  const handleRenameCancel = () => {
    setCurrRenameFolderId(null);
    setRenameValue('');
  };

  const handleKeyDown = (e, folderId, prevName) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(folderId, prevName);
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleDelete = async (_id, folderName) => {
    setOpenMenuId(null);
    const deletedFolderIdx = folders.findIndex(f => f._id === _id);
    const deletedFolder = folders[deletedFolderIdx];
    try {
      // Update UI
      dispatch(deleteFolder(_id));

      // Call axios
      const res = await API.delete('/folder/delete', { data: { _id, folderName } });
    }
    catch (err) {
      const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
      dispatch(setError(errorMsg));
      dispatch(addFolderAtIdx({ folder: deletedFolder, idx: deletedFolderIdx }));
    }
  }

  const handleCreate = () => {
    dispatch(toggleFolderCreate());
  }

  const handleFolderClick = async (_id) => {
    const folder = folders.find(f => f._id === _id);
    dispatch(setCurrFolder(folder));
    dispatch(toggleSidebar());
  }

  return (
    <div className="lg:w-[350px] h-full bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border-r border-[rgba(255,255,255,0.1)] flex flex-col p-8 max-lg:w-screen pr-2">
      {/* Title and hamburger button */}
      <div className='flex justify-between items-start'>
        <h2 className="mb-6 text-white text-3xl font-bold font-roboto">Folders</h2>
        {isMobile && (<div className={`btnContainer transition-all duration-500 ease-out`}>
          <button className={`bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl text-white font-medium cursor-pointer transition-all duration-300 flex items-center gap-1 hover:bg-[rgba(255,255,255,0.15)] hover:scale-[1.05] max-md:focus:bg-[rgba(255,255,255,0.15)] max-md:focus:scale-[1.05] text-center h-[50px] w-[60px] justify-center`} onClick={handleHamburgerClick}><RxHamburgerMenu size={20} /></button>
        </div>)}
      </div>


      <div className='flex flex-col flex-1 justify-between'>
      {/* Navigation Items */}
      <AnimatePresence mode='wait'>

        {folders.length ? (<motion.div key="folders" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1, ease: "easeOut"}} className="flex flex-col gap-2 flex-1 overflow-y-auto mb-6">
          {folders.map((folder) => (
            <div
              tabIndex={0}
              key={folder._id}
              onClick={() => !currRenameFolderId && handleFolderClick(folder._id)}
              className={`p-4 text-2xl font-medium rounded-xl cursor-pointer transition-all duration-300 w-[95%] group relative flex justify-between items-center ${(currFolder && currFolder._id === folder._id)
                  ? "bg-[rgba(255,255,255,0.15)] text-white"
                  : "text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white max-md:focus:bg-[rgba(255,255,255,0.1)] max-md:focus:text-white"
                } ${currRenameFolderId === folder._id ? 'cursor-default' : ''}`}
            >

              {/* Folder name or rename input */}
              {currRenameFolderId === folder._id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    ref={inputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, folder._id, folder.name)}
                    className="flex-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg px-3 py-2 text-white text-xl placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[rgba(255,255,255,0.4)] focus:bg-[rgba(255,255,255,0.15)] transition-all duration-200"
                    placeholder="Folder name" autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameSubmit(folder._id, folder.name);
                      }}
                      disabled={!renameValue.trim()}
                      className={`p-2 rounded-lg transition-all duration-200 ${renameValue.trim()
                          ? 'text-green-400 hover:bg-[rgba(34,197,94,0.1)] max-md:focus:bg-[rgba(34,197,94,0.1)] cursor-pointer'
                          : 'text-[rgba(255,255,255,0.3)] cursor-not-allowed'
                        }`}
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameCancel();
                      }}
                      className="p-2 rounded-lg text-red-400 hover:bg-[rgba(239,68,68,0.1)] max-md:focus:bg-[rgba(239,68,68,0.1)] transition-all duration-200"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className='max-w-[80%] break-words whitespace-normal'>{folder.name}</p>
                  {/* Three-dot menu button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(folder._id);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] ${openMenuId === folder._id ? "lg:scale-100 lg:opacity-100" : "lg:scale-0 lg:opacity-100"}  lg:group-hover:opacity-100 lg:group-hover:scale-100 opacity-100 scale-100`}
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {/* Dropdown menu */}
                    {openMenuId === folder._id && (
                      <AnimatePresence>
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 top-full mt-1 border-[rgba(255,255,255,0.1)] border rounded-lg shadow-lg z-10 min-w-[120px] bg-[rgba(30,30,35,0.46)] backdrop-blur-[5px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(folder._id, folder.name);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] rounded-t-md w-full text-left text-[18px] transition-all"
                          >
                            <FiEdit2 size={14} className='relative bottom-[1px]' />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(folder._id, folder.name);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] rounded-b-md w-full text-left text-[18px] transition-all"
                          >
                            <FiTrash size={14} className='relative bottom-[1px]' />
                            Delete
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </motion.div>):(<motion.div key="noFolderTxt" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1, ease: "easeOut"}} className='text-red-400 text-2xl mb-6'>Create a folder bro</motion.div >)}
        
        
        </AnimatePresence>

        {/* Create Folder Button */}
        <button
          onClick={handleCreate}
          className="px-4 py-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl text-[rgba(255,255,255,0.8)] text-2xl cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-[rgba(255,255,255,0.15)] max-md:focus:bg-[rgba(255,255,255,0.15)] hover:text-white max-md:focus:text-white w-[95%]"
        >
          + Create Folder
        </button>
        </div>
    </div>
  );
};

export default Sidebar;