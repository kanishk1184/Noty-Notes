import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AuthErrorText = ({text}) => {
  return (
    <AnimatePresence>
        <motion.div layout initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}} transition={{duration: 0.2}} className={`text-red-500 text-xl font-dongle text-center`} >{text}</motion.div>
    </AnimatePresence>
  )
}

export default AuthErrorText
