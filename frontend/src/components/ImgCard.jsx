import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ImgCard = () => {
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(rawX, { stiffness: 100, damping: 12 });
  const rotateY = useSpring(rawY, { stiffness: 100, damping: 12 });

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rawX.set(-(y - centerY) / 8);
    rawY.set((x - centerX) / 8);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  return (
    <div
      className="relative w-[320px] h-[240px] overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Side Card Sliding In */}
      <motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={isHovered ? { x: 200, opacity: 1 } : { x: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-60 w-50 rounded-3xl bg-[#104440] flex items-center justify-center z-0 mt-20"
        style={{ fontFamily: "Poppins" }}
      >
        
        <h1 className="text-white text-2xl font-semibold text-center px-4">
          More than 1500 products listed
        </h1>
        
        {/* <img src="/brand2.png" alt="ui-home" className='h-70 w-auto' /> */}
      </motion.div>

      {/* Main Tilt Card sliding left smoothly */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        animate={{ x: isHovered ? -64 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-100 w-fit cursor-pointer flex flex-col items-center justify-center z-10"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
      >
        <div className="flex flex-col items-center">
            <img src="/brand2.png" alt="ui-home" className='h-80 w-auto' />

        </div>
      </motion.div>
    </div>
  );
};


export default ImgCard
