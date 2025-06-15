import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import "./background.css"

const Background = () => {
  const [vis2, setVis2] = useState(false);
  const [vis3, setVis3] = useState(false);
  const [vis4, setVis4] = useState(false);
  const interactiveRef = useRef(null);

  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const interBubble = interactiveRef.current;

    function move() {
      curX += (tgX - curX) / 15;
      curY += (tgY - curY) / 15;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(move);
    }

    function onMouseMove(e) {
      tgX = e.clientX;
      tgY = e.clientY;
    }

    window.addEventListener('mousemove', onMouseMove);
    move();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container relative">
            <motion.div key="interactive" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, ease: "easeOut"}} ref={interactiveRef} onAnimationComplete={()=> setVis2(true)} className="interactive"></motion.div>
            {vis2 && <motion.div key="g1" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, ease: "easeOut"}} onAnimationComplete={()=>setVis3(true)} className="g1"></motion.div>}
            {vis3 && <motion.div key="g2" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, ease: "easeOut"}} onAnimationComplete={()=> setVis4(true)} className="g2"></motion.div>}
            {vis4 && <motion.div key="g3" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, ease: "easeOut"}} className="g3"></motion.div>}
        </div>
      </div>
    </>
  )
}

export default Background
