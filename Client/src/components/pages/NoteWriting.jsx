import React, { useCallback, useEffect, useRef, useState } from 'react'
import NoteWritingBtn from '../common/NoteWritingBtn'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder';
import { TfiMoreAlt } from "react-icons/tfi";
import { FaBold, FaItalic, FaHighlighter } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa6";
import { IoMdColorPalette } from "react-icons/io";
import { RiFontSize } from "react-icons/ri";
import { MdFormatListBulleted } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import Toolbar from '../common/Toolbar';
import ToolbarBtn from '../common/ToolbarBtn';
import Underline from '@tiptap/extension-underline';
import FontSizePanel from '../common/FontSizePanel';
import FontSize from '../../extensions/fontSize';
import ColorPanel from '../common/ColorPanel';
import { FaArrowDown } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlinePushPin } from "react-icons/md";
import { MdPushPin } from "react-icons/md";
import IconToggleButton from '../common/IconToggleButton';
import { togglePin, toggleFavorite, updateCurrContent, setCurrNote, updateCurrTitle } from '../../features/notes/noteSlice';
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import NoteDeletionDialog from '../common/NoteDeletionDialog';
import NoteSaveExportBtn from '../common/NoteSaveExportBtn';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../axios';
import html2pdf from "html2pdf.js";
import ErrorDialog from '../common/ErrorDialog';
import { setCurrFolder } from '../../features/folders/folderSlice';
import { setCRBG, setError } from '../../features/ui-ux/uiSlice';
import debounce from 'lodash/debounce';
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineSave } from "react-icons/md";
import { CiSaveUp2 } from "react-icons/ci";
import { Helmet } from 'react-helmet';


const placeholderTxt = "Your writing/drawing space is hereee...\n\n" +
    "You may set the text color, highlight it, set bold, italics, underline and even draw with the pen icon on the toolbar\n\n" +
    "If you stop typing for 3s it'll save automatically"

const NoteWriting = () => {
    const [title, setTitle] = useState("");
    const [currToolbar, setCurrToolbar] = useState("more");
    const [currSize, setCurrSize] = useState(30);
    const [isFontPanelOpen, setIsFontPanelOpen] = useState(false);
    const [openColorPanel, setOpenColorPanel] = useState(false);
    const [openHighlightPanel, setOpenHighlightPanel] = useState(false);
    const [textColor, setTextColor] = useState('#ffffff');
    const [highlightColor, setHighlightColor] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { noteId } = useParams();
    const contentRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const currNote = useSelector(state => state.notes.currNote);
    const currFolder = useSelector(state => state.folders.currFolder);
    const error = useSelector(state => state.ui.error);
    const canRenderBackground = useSelector(state => state.ui.canRenderBackground);
    const isPinned = currNote? currNote.pinned:false;
    const isFavorite = currNote? currNote.favorite:false;
    const currFolderId = currNote? currNote.folderId:null;
    const createdDate = currNote? new Date(currNote.createdAt).toString().slice(4, 15): "Loading...";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [StarterKit, TextStyle, FontSize, Underline, Color, Highlight.configure({ multicolor: true, }), Image, Placeholder.configure({ placeholder: placeholderTxt, showOnlyWhenEditable: true, showOnlyWhenEmpty: true, includeChildren: false, }),],
        content: currNote?currNote.content:"",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            dispatch(updateCurrContent(html));
            debouncedSave(title, html, isPinned, isFavorite);
        },
    });

    const debouncedSave = useCallback(
        debounce(async (title, content, isPinned, isFavorite) => {
            try{
                await API.put('/note/update', {_id: noteId, folderId: currFolderId, title, content, pinned: isPinned, favorite: isFavorite});
            }
            catch (err) {
                const errorMsg = err.response ? err.response.data.message : "Error auto-saving, Will try again.";
                dispatch(setError(errorMsg));
            }
        }, 3000) 
    ,[]
    );

    
    useEffect(() => {
        
        if (contentRef.current) {
            const size = Math.round(parseFloat(window.getComputedStyle(contentRef.current).fontSize.slice(0, 2)));
            setCurrSize(size);
        }
        
        // Fetch currNote if not available in redux
        const fetchNote = async () => {
            try{
                const res = await API.get(`/note/${noteId}`);
                dispatch(setCurrNote(res.data.note));
                setTitle(res.data.note.title);
                editor.commands.setContent(res.data.note.content);
            }
            catch (err) {
                const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
                dispatch(setError(errorMsg));
            }
        }
        
        if (!currNote) fetchNote();
        
        // Now set the title
        if (currNote) {
            setTitle(currNote.title);
            editor.commands.setContent(currNote.content);
        }
        
    }, []);
    
    useEffect(()=>{
        const fetchcurrFolder = async () =>{
            try {
                const res = await API.get(`/folder/${currFolderId}`);
                dispatch(setCurrFolder(res.data.folder));
            } catch (err) {
                const errorMsg = err.response ? err.response.data.message : "Something went wrong!";
                dispatch(setError(errorMsg));
            }
        }
        if (currFolderId && !currFolder) fetchcurrFolder();
    }, [currFolderId]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        editor.chain().focus().setColor(textColor).run()
    }, [openColorPanel]);

    useEffect(() => {
        if (highlightColor) editor.chain().focus().setHighlight({ color: highlightColor }).run()
        else editor.chain().focus().unsetHighlight().run()
    }, [openHighlightPanel])

    useEffect(() => {
        if (currNote) dispatch(updateCurrTitle(title));
    }, [title])

    useEffect(()=>{
        if (error !== null){
          setTimeout(()=>{
            dispatch(setError(null));
          }, 5000);
        }
    }, [error])

    const handleBack = () => {
        dispatch(setCurrNote(null));
        navigate('/');
    }
    const handleSave =async () => {
        // Update in the backend
        try{
            await API.put('/note/update', currNote);
            setIsMobileMenuOpen(false);
        }
        catch (err) {
            const errorMsg = err.response ? err.response.data.message : "Can't Save, Please Try Again";
            dispatch(setError(errorMsg));
        }
    }
    const handleExport = () => {
        const opt = {
            margin:       0.5,
            filename:     title,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 3 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(contentRef.current).save();
        setIsMobileMenuOpen(false);
     }
    const handleMoreClick = () => setCurrToolbar("text");
    const handlePin = () => {
        const newPinned = !isPinned;
        dispatch(togglePin());
        debouncedSave(currNote.title, currNote.content, newPinned, isFavorite);
    }
    const handleFavorite = () => {
        const newFavorite = !isFavorite;
        dispatch(toggleFavorite());
        debouncedSave(currNote.title, currNote.content, isPinned, newFavorite);
    }
    const handleDeleteBtn = () => {
        setIsDeleting(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
        <Helmet>
            <title>Note Writing</title>
        </Helmet>
        <AnimatePresence>
            {/* Note Deletion Dialog */}
            {isDeleting && (<motion.div key="deletDialog" initial={{ backdropFilter: "blur(0px)" }} animate={{ backdropFilter: "blur(20px)", transition: { type: "spring", duration: 0.4 } }} exit={{ backdropFilter: "blur(0px)", transition: { duration: 0.3, type: "easeOut" } }} className='fixed z-20 w-screen h-screen flex items-center justify-center'>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: "spring", duration: 0.4 } }} exit={{ scale: 0, transition: { duration: 0.3, type: "easeOut" } }}>
                    <NoteDeletionDialog isDeleting={isDeleting} setIsDeleting={setIsDeleting} />
                </motion.div>
            </motion.div>)}
            {/* Error Dialog */}
            {error && <motion.div key="errorDialog" initial={{opacity: 0, y:-10}} animate={{opacity: 1, y:0}} exit={{opacity: 0, y:-10}} transition={{duration: 0.3, type: "easeOut"}} className='z-20 fixed top-8 left-[50%] text-red-400 text-center bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1 flex items-center gap-1'>
            <ErrorDialog/>
          </motion.div>}
        </AnimatePresence>
            <div className="noteContainer relative z-10 flex flex-col h-screen w-screen items-center overflow-y-auto overflow-x-hidden">
                {/* Header */}
                <motion.div key="header" initial={{y: "-100%"}} animate={{y: 0}} transition={{duration: 0.3, ease: "easeOut"}} className='w-screen bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] p-5 border-b flex justify-between gap-2 relative z-30'>
                    <div className='flex items-center max-sm:p-1'>
                        <NoteWritingBtn handleClick={handleBack} extraClass={"max-sm:py-2"}>
                            <IoMdArrowRoundBack size={16} className='relative sm:bottom-[2px]' />
                            <div className='text-lg md:text-2xl max-sm:hidden'>Back</div>
                        </NoteWritingBtn>
                    </div>
                    <div className='text-white text-2xl md:text-3xl lg:text-4xl text-center flex items-center justify-center'>What's on your mind then?</div>
                    <div className="flex gap-2 lg:gap-3 items-center text-lg md:text-2xl">
                        <IconToggleButton onClick={handlePin} isActive={isPinned} activeTitle={"Unpin"} unActiveTitle={"Pin"} activeColor={"blue"} extraClass="relative top-[2px]">
                            {isPinned ? <MdPushPin /> : <MdOutlinePushPin />}
                        </IconToggleButton>
                        <IconToggleButton onClick={handleFavorite} isActive={isFavorite} activeColor={"yellow"} activeTitle={"Unfavorite"} unActiveTitle={"Favorite"}>
                            {isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
                        </IconToggleButton>
                        
                        {/* Desktop buttons (lg and above) */}
                        <div className="hidden lg:flex gap-3 items-center">
                            <IconToggleButton onClick={handleDeleteBtn} activeColor={"red"} activeTitle={"Delete"} unActiveTitle={"Delete"} isActive={isDeleting}>
                                <MdDeleteForever />
                            </IconToggleButton>
                            <NoteSaveExportBtn extraClass="text-white bg-blue-400 hover:shadow-[0_0_10px_rgba(96,165,250,0.5)] max-md:focus:shadow-[0_0_10px_rgba(96,165,250,0.5)]" handleClick={handleSave}>
                                <div>Save</div>
                            </NoteSaveExportBtn >
                            <NoteSaveExportBtn extraClass="text-black bg-white hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] max-md:focus:shadow-[0_0_10px_rgba(255,255,255,0.4)]" handleClick={handleExport} >
                                <div>Export</div>
                            </NoteSaveExportBtn >
                        </div>

                        {/* Mobile menu button (below lg) */}
                        <div className="lg:hidden relative flex items-center justify-center" ref={mobileMenuRef}>
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className='px-3 py-2 backdrop-blur-[5px] border-[rgba(255,255,255,0.2)] border rounded-full text-white bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] max-md:focus:bg-[rgba(255,255,255,0.15)] transition-all duration-300 ease-out hover:scale-[1.1] max-md:focus:scale-[1.1]'
                                title="More options"
                            >
                                <HiDotsVertical size={18} />
                            </button>
                            
                            {/* Mobile dropdown menu */}
                            <AnimatePresence>
                                {isMobileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 top-full mt-2 w-32 bg-[rgba(30,30,35,0.95)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-hidden z-50"
                                    >
                                        <button
                                            onClick={handleSave}
                                            className="w-full px-4 py-3 text-left text-white hover:bg-[rgba(96,165,250,0.2)] max-md:focus:bg-[rgba(96,165,250,0.2)] transition-all duration-200 flex items-center gap-2 border-b border-[rgba(255,255,255,0.1)]"
                                        >
                                            <MdOutlineSave size={16} className='relative bottom-[3px]'/>
                                            Save
                                        </button>
                                        <button
                                            onClick={handleExport}
                                            className="w-full px-4 py-3 text-left text-white hover:bg-[rgba(255,255,255,0.1)] max-md:focus:bg-[rgba(255,255,255,0.1)] transition-all duration-200 flex items-center gap-2 border-b border-[rgba(255,255,255,0.1)]"
                                        >
                                            <CiSaveUp2 size={16} className='relative bottom-[3px]'/>
                                            Export
                                        </button>
                                        <button
                                            onClick={handleDeleteBtn}
                                            className="w-full px-4 py-3 text-left text-red-400 hover:bg-[rgba(239,68,68,0.2)] max-md:focus:bg-[rgba(239,68,68,0.2)] transition-all duration-200 flex items-center gap-2"
                                        >
                                            <MdDeleteForever size={16} className='relative bottom-[3px]'/>
                                            Delete
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
                {/* Title+Content */}
                <motion.div key="titleContent" initial={{x: "-100%"}} animate={{x: 0}} transition={{duration: 0.4, type: "spring"}} onAnimationComplete={()=>{
                    if (!canRenderBackground) dispatch(setCRBG(true))
                    }} className='flex flex-col items-center gap-5 h-full pt-8 md:pb-8 w-screen lg:w-[60%] md:w-[90%] relative'>
                    <input type="text" placeholder='Title' onChange={e => {
                        debouncedSave(e.target.value, currNote.content, isPinned, isFavorite);
                        setTitle(e.target.value);
                        }} className='shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] border-t border-b md:border hover:bg-[rgba(33,33,39,0.75)] hover:scale-[1.01] max-md:focus:bg-[rgba(33,33,39,0.75)] max-md:focus:scale-[1.01] text-2xl md:text-4xl text-white placeholder:text-gray-400 px-6 py-4 md:rounded-3xl focus:placeholder:text-xl placeholder:transition-all transition-all duration-300 ease-out w-full' value={title}/>
                    <div className="info flex justify-between text-white text-xl md:text-2xl w-full px-6">
                        <div className='flex items-center justify-center'>{createdDate}</div>
                        <div className='px-3 py-1 backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] border rounded-full text-white bg-[rgba(255,255,255,0.15)] max-w-1/2 overflow-ellipsis overflow-hidden'>{currFolder? currFolder.name: "Loading..."}</div>
                    </div>
                    <div className='content relative shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] border-t border-b md:border text-lg md:text-2xl lg:text-3xl text-white placeholder:text-gray-400 md:rounded-3xl focus:placeholder:text-xl placeholder:transition-all flex-1 w-full'>
                        <EditorContent editor={editor} ref={contentRef} className='relative z-10 min-h-full w-full px-6 py-4 ProseMirror [&_p.is-empty::before]:text-gray-500' />
                    </div>
                </motion.div>
                {/* Toolbar */}
                <div className='toolbar fixed bottom-2'>
                    <AnimatePresence mode='wait'>

                        {currToolbar === "more" && (<motion.div key={"more"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.1, ease: "easeOut" }}><button className='px-3 py-1 backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] border rounded-full text-white bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.2)] max-md:focus:bg-[rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:scale-[1.1] max-md:focus:scale-[1.1]' onClick={handleMoreClick}>
                            <TfiMoreAlt size={20} />
                        </button></motion.div>)}
                        {currToolbar === "text" && (
                            <motion.div key={"text"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.1, ease: "easeOut" }}>
                                <Toolbar>
                                    <ToolbarBtn handleClick={() => { editor.chain().focus().toggleBold().run() }} extraClass={editor.isActive('bold') ? "bg-[rgba(255,255,255,0.2)] rounded-l-full" : "rounded-l-full"} title='Bold'><FaBold size={20} /></ToolbarBtn>
                                    <ToolbarBtn handleClick={() => { editor.chain().focus().toggleItalic().run() }} extraClass={editor.isActive('italic') ? "bg-[rgba(255,255,255,0.2)]" : ""} title='Italic'><FaItalic size={20} /></ToolbarBtn>
                                    <ToolbarBtn handleClick={() => { editor.chain().focus().toggleUnderline().run() }} extraClass={editor.isActive('underline') ? "bg-[rgba(255,255,255,0.2)]" : ""} title="Underline"><FaUnderline size={20}/></ToolbarBtn>
                                    <ToolbarBtn handleClick={() => {
                                        setOpenColorPanel(false);
                                        setOpenHighlightPanel(false);
                                        setIsFontPanelOpen(!isFontPanelOpen);
                                    }} extraClass={isFontPanelOpen ? "bg-[rgba(255,255,255,0.2)]" : ""} title="Font Size"><RiFontSize size={20} /></ToolbarBtn>
                                    {(!openColorPanel && !openHighlightPanel && isFontPanelOpen) && (<FontSizePanel props={{ editor, isFontPanelOpen, setIsFontPanelOpen, currSize, setCurrSize }} />)}
                                    <ToolbarBtn handleClick={() => { editor.chain().focus().toggleBulletList().run() }} extraClass={editor.isActive('bulletList') ? "bg-[rgba(255,255,255,0.2)]" : ""} title="Bullet Points" ><MdFormatListBulleted size={20} /></ToolbarBtn>
                                    <ToolbarBtn handleClick={() => { editor.chain().focus().toggleOrderedList().run() }} extraClass={editor.isActive('orderedList') ? "bg-[rgba(255,255,255,0.2)]" : ""} title="Numbered Bullets"><GoListOrdered size={20} /></ToolbarBtn>
                                    <ToolbarBtn handleClick={() => {
                                        setIsFontPanelOpen(false);
                                        setOpenHighlightPanel(false);
                                        setOpenColorPanel(!openColorPanel);
                                    }} extraClass={openColorPanel && "bg-[rgba(255,255,255,0.2)]"} title="Font Color"><IoMdColorPalette size={20} /></ToolbarBtn>
                                    {(!isFontPanelOpen && !openHighlightPanel && openColorPanel) && <ColorPanel color={textColor} setColor={setTextColor} setOpenColorPanel={setOpenColorPanel} />}
                                    <ToolbarBtn extraClass={`${openHighlightPanel && "bg-[rgba(255,255,255,0.2)]"}`} handleClick={() => {
                                        setIsFontPanelOpen(false);
                                        setOpenColorPanel(false);
                                        setOpenHighlightPanel(!openHighlightPanel);
                                    }} title="Highlight Text"><FaHighlighter size={20} /></ToolbarBtn>
                                    {(!isFontPanelOpen && !openColorPanel && openHighlightPanel) && <ColorPanel color={highlightColor} setColor={setHighlightColor} setOpenColorPanel={setOpenHighlightPanel} showNone={true} />}
                                    <ToolbarBtn extraClass={`rounded-r-full`} handleClick={() => setCurrToolbar("more")} title="Hide Toolbar"><FaArrowDown size={20} /></ToolbarBtn>
                                </Toolbar>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}

export default NoteWriting;