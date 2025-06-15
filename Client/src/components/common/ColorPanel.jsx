import React, { useRef, useState } from 'react'
import { RxColorWheel } from "react-icons/rx";
import { HexColorPicker } from "react-colorful";
import { RxValueNone } from "react-icons/rx";

const ColorPanel = ({ color, setColor, setOpenColorPanel, showNone = false }) => {
    const [ShowColorPicker, setShowColorPicker] = useState(false);
    const predefinedColors = [
    { name: 'white', value: '#ffffff' },
    { name: 'black', value: '#000000' },
    { name: 'red', value: '#ef4444' },
    { name: 'purple', value: '#a855f7' },
    { name: 'blue', value: '#3b82f6' },
    { name: 'yellow', value: '#eab308' },
    { name: 'green', value: '#22c55e' },
    { name: 'skyblue', value: '#0ea5e9' }
    ]

  return (
    <>
    <div className='backdrop-blur-[5px] border-[rgba(255,255,255,0.1)] border rounded-lg text-white bg-[rgba(255,255,255,0.15)] px-4 py-4 flex justify-center items-center absolute bottom-[120%]'>
        {showNone && <button className={`w-6 h-6 hover:scale-[1.2] focus:scale-[1.2]  transition-all duration-300 ease-out cursor-pointer`} onClick={()=>{
            setOpenColorPanel(false);
            setColor(null);
        }}><RxValueNone /></button>}
        {predefinedColors.map((color)=>(
            <button key={color.name} className={`w-6 h-6 hover:scale-[1.2] max-md:focus:scale-[1.2] transition-all duration-300 ease-out cursor-pointer`} style={{backgroundColor: color.value}} onClick={()=>{
                setOpenColorPanel(false);
                setColor(color.value)
            }}>
            </button>
        ))}
        {/* Color wheel */}
        <button className={`w-6 h-6 hover:scale-[1.2] max-md:focus:scale-[1.2] transition-all duration-300 ease-out cursor-pointer pl-1 pr-6`} onClick={()=>{
            setShowColorPicker(!ShowColorPicker);

        }}>
            <RxColorWheel size={20}/>
        </button>
        {ShowColorPicker && (<div className='absolute bottom-[130%]'><HexColorPicker color={color} onChange={setColor}/></div>)}
        


    </div>
    </>
  )
}

export default ColorPanel
