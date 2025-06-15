import React from 'react';
import Note from './NoteCard';
import { useDispatch, useSelector } from 'react-redux';
import { setError, toggleSidebar } from '../../features/ui-ux/uiSlice';
import { RxHamburgerMenu } from 'react-icons/rx';
import { clearNotesSlice, setCurrNote } from '../../features/notes/noteSlice';
import slugify from 'slugify';
import { useNavigate } from 'react-router-dom';
import API from '../../axios';
import { AnimatePresence, motion } from 'framer-motion';
import { CiLogout } from "react-icons/ci";
import { logout } from '../../features/auth/authSlice';
import { clearFoldersSlice } from '../../features/folders/folderSlice';

const Main = () => {
  const isMobile = useSelector(state => state.ui.isMobile);
  const folder = useSelector(state => state.folders.currFolder);
  const allNotes = useSelector(state => state.notes.notes);
  const notes = (folder && allNotes && allNotes[folder._id])? allNotes[folder._id]:[];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    dispatch(toggleSidebar());
  }

  const handleNewNote = async () => {
    try {
      const res = await API.post('/note/create', { folderId: folder._id, title: "", content: "" });
      dispatch(setCurrNote(res.data.note));
      navigate(`/note/${res.data.note._id}`);
    }
    catch (err) {
      const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
      dispatch(setError(errorMsg));
    }
  }

  const handleNoteclick = (note) => {
    // set the currNote to this note
    dispatch(setCurrNote(note));
    // Navigate to /note/:noteId
    const noteId = slugify(String(note._id));
    navigate(`/note/${noteId}`);
  }

  const handleLogout = () => {
    // Reset all the states
    dispatch(logout());
    dispatch(clearFoldersSlice());
    dispatch(clearNotesSlice());
    // Remove the token
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/auth');
  }

  return (
    <>
      <div className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-5 mb-10 w-full">
        {/* Hamburger on Mobile */}
          {isMobile && (<div className={`btnContainer transition-all duration-500 ease-out`}>
                    <button className={`bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl text-white font-medium cursor-pointer transition-all duration-300 flex items-center gap-1 hover:bg-[rgba(255,255,255,0.15)] max-md:focus:bg-[rgba(255,255,255,0.15)] hover:scale-[1.05] max-md:focus:scale-[1.05] text-center h-[50px] w-[60px] justify-center`} onClick={handleHamburgerClick}><RxHamburgerMenu size={20}/></button>
                  </div>)}

        {/* Folder Name with wrap */}
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-bold break-words whitespace-normal">
            {folder ? folder.name : "No folder Selected"}
          </h1>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3 py-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl text-white font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-[rgba(255,255,255,0.15)] max-md:focus:bg-[rgba(255,255,255,0.15)] not-disabled:hover:scale-[1.05] not-disabled:max-md:focus:scale-[1.05] text-center disabled:cursor-not-allowed shrink-0"
          title="Logout"
        >
          <CiLogout className="relative bottom-[2px]" />
          <span className="text-xl max-md:hidden">Logout</span>
        </button>
      </div>


      {/* Notes Grid */}
      <AnimatePresence mode='wait'>
        {notes.length ? (
          <motion.div key={"notesGrid"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1, ease: "easeOut" }} className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5 max-md:grid-cols-1 pb-5">
            {notes.map((note) => (
              <Note key={note._id} note={note} handleNoteclick={handleNoteclick} />
            ))}
          </motion.div>) : (
          <motion.div key={"noNotesTxt"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1, ease: "easeOut" }} className='text-red-400 text-3xl'>No notes here...Why don't you create one?{!folder && "(If you haven't created a folder yet, gotta do that first broooo)"}</motion.div>
        )}

      </AnimatePresence>
      <button
        onClick={handleNewNote}
        className="px-6 py-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl text-white font-medium cursor-pointer transition-all duration-300 flex items-center gap-1 hover:bg-[rgba(255,255,255,0.15)] max-md:focus:bg-[rgba(255,255,255,0.15)] not-disabled:hover:scale-[1.05] not-disabled:max-md:focus:scale-[1.05] fixed bottom-8 right-8 text-center disabled:cursor-not-allowed disabled:line-through" disabled={!folder} title={folder ? "Create new Note in this folder" : "No folder selected"}
      >
        <span className='text-md relative top-[1px]'>📝</span>
        <span className='text-xl'>New Note</span>
      </button>
      </div>
    </>
  );
};

export default Main;