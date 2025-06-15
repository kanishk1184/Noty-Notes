import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: null, // {folderId1: [], folderId2: [], ...}
  currNote: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex(n => n._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      if (state.currNote?._id === action.payload._id) {
        state.currNote = action.payload;
      }
    },
    setCurrNote: (state, action) => {
      state.currNote = action.payload;
    },
    togglePin: (state)=>{
      state.currNote.pinned = !state.currNote.pinned;

      // Update curr note in notes(No need for now as dashboard will call to backend for notes)
      // const idx = state.notes[state.currNote.folderId].findIndex(f=> f._id === state.currNote._id);
      // if (idx !== -1) state.notes[state.currNote.folderId][idx] = state.currNote;

    },
    toggleFavorite: (state)=>{
      state.currNote.favorite = !state.currNote.favorite;
      
      // Update curr note in notes(No need for now as dashboard will call to backend for notes)
      // const idx = state.notes[state.currNote.folderId].findIndex(f=> f._id === state.currNote._id);
      // if (idx !== -1) state.notes[state.currNote.folderId][idx] = state.currNote;
      
    },
    updateCurrContent: (state, action)=>{
      state.currNote.content = action.payload;

      // Update curr note in notes(No need for now as dashboard will call to backend for notes)
      // const idx = state.notes[state.currNote.folderId].findIndex(f=> f._id === state.currNote._id);
      // if (idx !== -1) state.notes[state.currNote.folderId][idx] = state.currNote;

    },
    updateCurrTitle: (state, action)=>{
      state.currNote.title = action.payload;
      
      // Update curr note in notes(No need for now as dashboard will call to backend for notes)
      // const idx = state.notes[state.currNote.folderId].findIndex(f=> f._id === state.currNote._id);
      // if (idx !== -1) state.notes[state.currNote.folderId][idx] = state.currNote;
    },
    clearNotesSlice(state) {
      state.notes = null;
      state.currNote = null;
    }
  }
});

export const {
  setNotes,
  addNote,
  updateNote,
  setCurrNote,
  togglePin,
  toggleFavorite,
  updateCurrContent,
  updateCurrTitle,
  clearNotesSlice,
} = notesSlice.actions;

export default notesSlice.reducer;
