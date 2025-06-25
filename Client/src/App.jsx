import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCRBG } from "./features/ui-ux/uiSlice";
import ProtectedRoute from "./components/common/ProtectedRoute"
import API from "./axios";

// Lazy Loaded Components
const AuthForm = lazy(() => import("./components/pages/AuthForm"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const NoteWriting = lazy(() => import("./components/pages/NoteWriting"));
const NotFound = lazy(() => import("./components/common/NotFound"));
const Background = lazy(() => import("./components/common/Background"));

function App() {
  const canRenderBackground = useSelector(state => state.ui.canRenderBackground);
  const location = useLocation();
  const dispatch = useDispatch();

  // health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await API.get("health");
        console.log("Backend is Live");
      } catch (err) {
        console.log("Backend down or Sleeping");
      }
    };

    checkHealth();
    const healthIntervalId = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(healthIntervalId);
  }, []);


  return (
    <div className="wrapper overflow-hidden">
      {canRenderBackground && <Background />}
      <Suspense fallback={<div className="text-white text-5xl text-center w-screen h-screen flex items-center justify-center"><p>Loading...</p></div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path='/auth'
              element={
                <motion.div
                  key="authForm"
                  initial={{ scale: 0.8, y: "-100%" }}
                  animate={{ scale: 1, y: "0" }}
                  exit={{ scale: 0.8, y: "100%" }}
                  transition={{ duration: 0.8, type: "spring" }}
                  onAnimationComplete={() => {
                    if (!canRenderBackground) dispatch(setCRBG(true));
                  }}
                  className="overflow-hidden flex justify-center items-center h-[100vh] z-10 relative"
                >
                  <AuthForm />
                </motion.div>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <motion.div key="dashboard" animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 5 }}>
                    <Dashboard />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/note/:noteId"
              element={
                <ProtectedRoute>
                  <motion.div key="note" animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "-40%" }} className="overflow-hidden">
                    <NoteWriting />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
