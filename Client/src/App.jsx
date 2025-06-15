import React, { useEffect } from "react"
import AuthForm from "./components/pages/AuthForm"
import Dashboard from "./components/pages/Dashboard"
import { Route, Routes, useLocation } from "react-router-dom"
import ProtectedRoute from "./components/common/ProtectedRoute"
import NoteWriting from "./components/pages/NoteWriting"
import { AnimatePresence, motion } from "framer-motion"
import Background from "./components/common/Background"
import { useDispatch, useSelector } from "react-redux"
import { setCRBG } from "./features/ui-ux/uiSlice"
import NotFound from "./components/common/NotFound"
import API from "./axios"

function App() {
  const canRenderBackground = useSelector(state=>state.ui.canRenderBackground);
  const location = useLocation();
  const dispatch = useDispatch();

  // To keep server warm
  useEffect(()=>{

    const checkHealth = async ()=>{
      try{
        await API.get("health");

        console.log("Backend is Live");
      }
      catch (err) {
        console.log("Backend down or Sleeping");
      }
    }

    checkHealth();

    const healthIntervalId = setInterval(checkHealth, 5*60*1000);

    return ()=> clearInterval(healthIntervalId);
  }, []);

  return (
    <>
      <div className="wrapper overflow-hidden">
      {canRenderBackground && <Background />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/auth' element={
            <motion.div key="authForm" initial={{scale: 0.8, y: "-100%"}} animate={{scale: 1, y: "0"}} exit={{scale: 0.8, y: "100%"}} transition={{duration: 0.8, type: "spring"}} onAnimationComplete={()=>{
              if (!canRenderBackground) dispatch(setCRBG(true));
            }} className="overflow-hidden flex justify-center items-center h-[100vh] z-10 relative">
              <AuthForm />
            </motion.div>
            } />
          <Route path="/" element={
            <ProtectedRoute>
              <motion.div key="dashboard" animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 5}}>
                <Dashboard />
              </motion.div>
            </ProtectedRoute>
            } />
          <Route path="/note/:noteId" element={
            <ProtectedRoute>
              <motion.div key="note" animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: "-40%"}} className="overflow-hidden">
                <NoteWriting />
              </motion.div>
            </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound/>} />
        </Routes>
      </AnimatePresence>
      </div>
    </>
  )
}

export default App
