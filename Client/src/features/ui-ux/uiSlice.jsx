import { createSlice } from "@reduxjs/toolkit";


// Use isMobile to check the render of hamburger feature
// IsSidebarOpen for mobiles only, no use of it in desktop
const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isMobile: false,
        isSidebarOpen: false,
        isCreatingFolder: false,
        canRenderBackground: false,
        error: null,
    },
    reducers: {
        setIsMobile: (state, action) =>{
            state.isMobile = action.payload;
        },
        toggleSidebar: (state) =>{
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        toggleFolderCreate: state =>{
            state.isCreatingFolder = !state.isCreatingFolder;
        },
        setError: (state, action) =>{
            state.error = action.payload;
        },
        setCRBG: (state, action) =>{
            state.canRenderBackground = action.payload;
        },
        setSidebar: (state, action) =>{
            state.isSidebarOpen = action.payload;
        }
    },
});

export const {setIsMobile, toggleSidebar, toggleFolderCreate, setError, setCRBG, setSidebar} = uiSlice.actions;
export default uiSlice.reducer;