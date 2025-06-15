import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../common/Sidebar';
import Main from '../common/Main';
import ErrorDashboard from '../common/ErrorDialog';
import { setCRBG, setIsMobile } from '../../features/ui-ux/uiSlice';
import { AnimatePresence, motion, spring } from 'framer-motion';
import FolderCreationDialog from '../common/FolderCreationDialog';
import { setCurrFolder, setFolders } from '../../features/folders/folderSlice';
import { setNotes } from '../../features/notes/noteSlice';
import { setError } from '../../features/ui-ux/uiSlice';
import API from '../../axios';
import { Helmet } from 'react-helmet';

const Dashboard = () => {
  const [loadingFolders, setLoadingFolders] = useState(false);
  const isMobile = useSelector(state=>state.ui.isMobile);
  const isSidebarOpen = useSelector(state=>state.ui.isSidebarOpen);
  const isCreatingFolder = useSelector(state=>state.ui.isCreatingFolder);
  const error = useSelector(state=>state.ui.error);
  const currFolder = useSelector(state => state.folders.currFolder);
  const canRenderBackground = useSelector(state=> state.ui.canRenderBackground);
  const dispatch = useDispatch();

  const handleResize = () =>{
    if (window.innerWidth < 1024) dispatch(setIsMobile(true));
    else dispatch(setIsMobile(false));
  }

  useEffect(()=>{
    handleResize();
    window.addEventListener('resize', handleResize);

    // Get all folders for current user and update the sidebar
    const fetchFolders = async ()=>{
      setLoadingFolders(true);
      try{
        const res = await API.get('folder/all');
        dispatch(setFolders(res.data.folders));

        if (res.data.folders.length) dispatch(setCurrFolder(res.data.folders[0]));
      }
      catch (err){
        const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
        dispatch(setError(errorMsg));
      }
      setLoadingFolders(false);
    }
    
    fetchFolders();

    return ()=>{ window.removeEventListener('resize', handleResize)};
  }, []);

  // Fetch all the notes at the starting
  useEffect(()=>{
    const fetchAllNotes = async ()=>{
      try{
        const res = await API.get("note/all");
        const categorizedNotes = {};

        res.data.notes.forEach(note => {
          if (!categorizedNotes[note.folderId]) categorizedNotes[note.folderId] = [];
          categorizedNotes[note.folderId].push(note);
        });

        dispatch(setNotes(categorizedNotes));
      }
      catch (err) {
        const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
        dispatch(setError(errorMsg));
      }
    }
    fetchAllNotes();

    // Update these notes every 5 minutes from backend
    const intervalId = setInterval(fetchAllNotes, 5*60*1000);

    return ()=> clearInterval(intervalId);
  }, []);

  // Every time a error occurs make sure to remove it after some time
  useEffect(()=>{
    if (error !== null){
      setTimeout(()=>{
        dispatch(setError(null));
      }, 5000);
    }
  }, [error])

  
  return (
    <>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>
      <div className="flex h-screen relative z-10 overflow-hidden">
        <AnimatePresence>
          {/* Render Sidebar only if device isnt a mobile or sidebar is open in mobile */}
          {(!loadingFolders && (!isMobile || isSidebarOpen)) && (
            <motion.div key='sidebar' initial={{opacity: 0, x: '-100%'}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: '-100%'}} transition={{duration: 0.4, ease: "easeOut"}} >
                <Sidebar/>
              </motion.div>
            )}

          {/* Rendering the main section accordingly */}
          {(!loadingFolders && (!isMobile || !isSidebarOpen)) && (
            <motion.div key='main' initial={{opacity: 0, x: '50%'}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: '50%'}} transition={{duration: 0.6, type: "spring"}} className='w-full overflow-auto' onAnimationComplete={()=>{
              if (!canRenderBackground) dispatch(setCRBG(true));
            }}>
              <Main/>
            </motion.div>
            )}
            {/* Renders the folder creation dialog */}
            {isCreatingFolder && (<motion.div key="folderDialog" initial={{backdropFilter: "blur(0px)"}} animate={{backdropFilter: "blur(20px)", transition: {type: "spring", duration: 0.4}}} exit={{backdropFilter: "blur(0px)", transition: {duration: 0.3, type: "easeOut"}}} className='fixed z-20 w-screen h-screen flex items-center justify-center'>
              <motion.div initial={{scale: 0}} animate={{scale: 1, transition: {type: "spring", duration: 0.4}}} exit={{scale: 0, transition: {duration: 0.3, type: "easeOut"}}}>
                <FolderCreationDialog/>
              </motion.div>
            </motion.div>)}
          
          {/* Displays any error message generated */}
          {error && <motion.div key="errorDialog" initial={{opacity: 0, y:10}} animate={{opacity: 1, y:0}} exit={{opacity: 0, y:10}} transition={{duration: 0.3, type: "easeOut"}} className='fixed lg:bottom-8 max-lg:top-8 left-[50%] text-red-400 text-center bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1 flex items-center gap-1'>
            <ErrorDashboard/>
          </motion.div>}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dashboard;