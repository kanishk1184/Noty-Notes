import React from "react";
import { motion } from "framer-motion";

const IconToggleButton = ({ isActive, onClick, children, activeTitle, unActiveTitle, activeColor, extraClass }) => {
    const colorMap = {
        yellow: {
            text: "text-yellow-500",
            hover: "hover:text-yellow-500 max-md:focus:text-yellow-500",
        },
        red: {
            text: "text-red-500",
            hover: "hover:text-red-500 max-md:focus:text-red-500",
        },
        blue: {
            text: "text-blue-500",
            hover: "hover:text-blue-500 max-md:focus:text-blue-500",
        },
    };

    const color = colorMap[activeColor];

  return (
    <motion.button
      onClick={onClick}
      className={`p-1 rounded-full duration-300 hover:scale-[1.2] focus:scale-[1.2] transition-all hover:cursor-pointer ${
          isActive
            ? color.text+" drop-shadow-md scale-[1.2]"
            : "text-gray-500 "+color.hover}`}
      title={isActive ? activeTitle : unActiveTitle}
    >
      <motion.div
        key={activeTitle}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`transition-all flex items-center justify-center ${extraClass}`}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};

export default IconToggleButton;
