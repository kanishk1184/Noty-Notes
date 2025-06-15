import { createSlice } from '@reduxjs/toolkit';

const folderSlice = createSlice({
  name: 'folders',
  initialState: {
    folders: [],
    currFolder: null,
  },
  reducers: {
    setFolders(state, action) {
      state.folders = action.payload; // set folders from backend
    },
    addFolder(state, action) {
      state.folders.push(action.payload); // add new folder
    },
    addFolderAtIdx(state, action) {
      const { folder, idx } = action.payload;
      state.folders.splice(idx, 0, folder);
    },
    deleteFolder(state, action) {
      state.folders = state.folders.filter(folder => folder._id !== action.payload);

      // Check if the folder to be deleted is the currFolder
      if (action.payload === state.currFolder._id){
        if (state.folders.length) state.currFolder = state.folders[0];
        else state.currFolder = null;
      }
    },
    updateFolderName(state, action) {
      const { _id, name } = action.payload;
      const folder = state.folders.find(f => f._id === _id);

      if (_id === state.currFolder._id) state.currFolder.name = name;
      if (folder) folder.name = name;
    },
    updateFolderId(state, action){
      const {_id, name } = action.payload;
      const folder = state.folders.find(f=> f.name === name);
      if (folder._id === state.currFolder._id) state.currFolder._id = _id;
      if (folder) folder._id = _id;
    },
    setCurrFolder(state, action) {
      state.currFolder = action.payload;
    },
    clearFoldersSlice(state) {
      state.currFolder = null;
      state.folders = [];
    },
  },
});

export const { setFolders, addFolder, addFolderAtIdx, deleteFolder, updateFolderName,updateFolderId, setCurrFolder, clearFoldersSlice } = folderSlice.actions;

export default folderSlice.reducer;
