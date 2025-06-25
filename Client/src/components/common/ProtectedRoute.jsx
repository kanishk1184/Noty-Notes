import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../axios';

const ProtectedRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null)
    const token = localStorage.getItem('token');
    
    useEffect(()=>{
        const checkToken = async ()=>{
            try{
                await API.post('/auth/checkToken', { token });
                setIsValid(true);
            }
            catch (err) {
                setIsValid(false);
                localStorage.removeItem('token');
            }
        }

        checkToken();
    }, [token]);

    return <>
        {isValid !== true && <div key="loadProtectedRoute" className="text-white text-5xl text-center w-screen h-screen flex items-center justify-center">
            {isValid === null && <p>Please wait(First load may take about a minute to wake server up)</p>}
            {isValid === false && <Navigate to="/auth" replace />}
        </div>}
        {isValid === true && children}
    </>
    

}

export default ProtectedRoute
