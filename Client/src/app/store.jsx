import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice';
import folderReducer from '../features/folders/folderSlice'
import uiReducer from '../features/ui-ux/uiSlice';
import noteReducer from '../features/notes/noteSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    folders: folderReducer,
    ui: uiReducer,
    notes: noteReducer,
  },
})