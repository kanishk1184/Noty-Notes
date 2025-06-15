import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
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
            }
        }

        checkToken();
    }, [token]);

    if (isValid === null) return null
    else if (isValid === false) return <Navigate to='/auth' replace />
    else return children

}

export default ProtectedRoute
