import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const InputField = ({ register, type, placeholder, name, rules, clearErrors, setValue, onFocus, onBlur }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        placeholder={placeholder}
        {...register(name, rules)}
        className="border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.1)] w-[100%] h-[50px] text-white placeholder-gray-400 px-4 pr-10 rounded-full max-md:focus:outline-none max-md:focus:placeholder:text-lg placeholder:transition-all hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.4)] focus:bg-[rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.4)] transition-all duration-300 parent-hover:bg-[rgba(255,255,255,0.1)] parent-hover:backdrop-blur-[10px] font-dongle text-[24px]"
        defaultValue={""}
        onChange={(e) => {
          clearErrors(name);
          setValue(name, e.target.value);
        }}
        onFocus={onFocus} onBlur={onBlur}
      />

      {/* Eye Icon */}
      {isPassword && (
        <button
          type='button'
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
}

export default InputField
