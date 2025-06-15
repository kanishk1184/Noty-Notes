import { EditorContent, useEditor } from '@tiptap/react';
import React from 'react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline';
import { FaStar } from "react-icons/fa6";
import { MdPushPin } from "react-icons/md";

const Note = ({ note, handleNoteclick }) => {
  const date = new Date(note.createdAt).toString().slice(4,15);
  const editor = useEditor({
        extensions: [StarterKit, TextStyle, Underline, Image,],
        content: note.content,
        
  });

  

  return (
    <button onClick={()=>handleNoteclick(note)}
      className="w-full min-h-[200px] bg-[rgba(30,30,35,0.85)] backdrop-blur-[5px] border border-[rgba(255,255,255,0.1)] flex flex-col relative rounded-3xl hover:bg-[rgba(0,0,0,0.15)] hover:backdrop-blur-[30px] hover:border-[rgba(255,255,255,0.3)] hover:scale-[1.05] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] max-md:focus:bg-[rgba(0,0,0,0.15)] max-md:focus:backdrop-blur-[30px] max-md:focus:border-[rgba(255,255,255,0.3)] max-md:focus:scale-[1.05] max-md:focus:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out p-6 cursor-pointer overflow-hidden items-start"
    >
      <div className='flex justify-between w-full text-left'>
        <h3 className={`text-3xl font-semibold mb-2 ${note.title? "text-white":"text-red-400"}`}>{note.title? note.title:"No Title"}</h3>
        {note.favorite && (<div title='Starred' className='text-yellow-500 relative top-[5px]'><FaStar size={22} /></div>)}
      </div>
      <div className="text-[rgba(255,255,255,0.7)] text-lg leading-6 mb-5 overflow-ellipsis line-clamp-2">
        <EditorContent editor={editor}/>
      </div>
      <div className='flex mt-auto justify-between w-full'>
        <p className="text-[rgba(255,255,255,0.5)] text-md font-normal">
          {date}
        </p>
        {note.pinned && (<div title='Pinned' className='text-blue-500'><MdPushPin size={24}/></div>)}
        
      </div>
    </button>
  );
};

export default Note;