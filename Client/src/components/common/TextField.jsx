import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TextField = ({ text}) => {
  return (
    <AnimatePresence>
        <motion.div layout initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.3}} className='text-white text-2xl font-medium font-dongle' >{text}</motion.div>
    </AnimatePresence>
  )
}

export default TextField
