import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useRef, useState } from "react";

const TiltCard = () => {
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
        animate={isHovered ? { x: 90, opacity: 1 } : { x: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-60 w-70 rounded-3xl bg-[#104440] flex items-center justify-center z-0"
        style={{ fontFamily: "Poppins" }}
      >
        <h1 className="text-white text-2xl font-semibold text-center px-4">
          More than 1500 products listed
        </h1>
      </motion.div>

      {/* Main Tilt Card sliding left smoothly */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        animate={{ x: isHovered ? -64 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 gap-5  bg-white h-60 w-50 rounded-3xl shadow-2xl cursor-pointer flex flex-col items-center justify-center z-10"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
      >
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-teal-900 text-5xl font-semibold pt-2 font-poppins">
            1500+
          </h1>
          <p className="text-black text-2xl font-medium font-poppins">
            Products
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="mt-3 border-2 border-teal-900 text-teal-900 px-4 py-1 rounded-xl font-medium transition-all duration-300 hover:bg-teal-900 hover:text-white"
        >
          <a href="/discover">Discover</a>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TiltCard;
