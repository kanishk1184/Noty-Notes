import React, { useState } from 'react';
import { set } from 'react-hook-form';

const FontSizePanel = ({ props }) => {
    const {editor, isFontPanelOpen, setIsFontPanelOpen, currSize, setCurrSize } = props;

    const handleSizeClick = (size)=>{
        setCurrSize(size);
        setIsFontPanelOpen(!isFontPanelOpen);
        editor.chain().focus().setFontSize(size).run();
    }
  // Generate font sizes array
  const fontSizes = [
    ...Array.from({ length: 15 }, (_, i) => i + 6), // 6-20
    22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 52, 56, 60, 64
  ];

  return (
    <div className="w-32 h-32 bg-[rgba(255,255,255,0.15)] backdrop-blur-[5px] border border-[rgba(255,255,255,0.1)] rounded-lg overflow-y-auto absolute z-20 bottom-[120%] flex flex-col">
        {fontSizes.map((size) => (
          <button
            key={size}
            onClick={()=>handleSizeClick(size)}
            className={`
              w-[90%] text-left px-3 py-2 text-white transition-all duration-200 ease-out
              hover:bg-[rgba(255,255,255,0.2)] max-md:focus:bg-[rgba(255,255,255,0.2)] hover:backdrop-blur-[5px] max-md:focus:backdrop-blur-[5px] flex items-center justify-between rounded-md m-1 ${currSize === size ? "bg-[rgba(255,255,255,0.2)]":""}
            `}
            autoFocus={currSize === size}
          >
            <span className="text-xl">
              {size}px
            </span>
          </button>
        ))}
    </div>
  );
};

export default FontSizePanel;