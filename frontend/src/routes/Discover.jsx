import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar'
import TiltCard from '../components/TiltCard'
import ProductCardHome from '../components/ProductCardHome'
import ImgCard from '../components/ImgCard'
import ItemCard from '../components/ItemCard'

const sampleProduct = {
  image: '/public/brand2.png',
  alt: 'Sample Product',
};
const sampleStartup = {
  image: '/public/SmartPicks-logo.png',
  alt: 'Sample Startup',
};

// Animation variants for staggered entrance
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const Discover = () => {
  return (
    <>
      <Navbar/>
      <div className='bg-teal-900 h-screen flex flex-row'>
        <div className='bg-[#104440] h-165 w-[64%] flex items-center gap-10'>
          <motion.div
            className='flex flex-col items-center gap-20'
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={itemVariants}
              className='text-6xl text-white font-medium p-2.5 w-150 h-fit flex items-center leading-21'
              style={{fontFamily:'poppins'}}
            >
              Discover standout products from emerging startups
            </motion.h1>
            <motion.button
              variants={itemVariants}
              className='bg-white h-15 w-60 rounded-2xl text-2xl font-medium'
            >
              Get Started
            </motion.button>
          </motion.div>
          <div className='flex flex-col mt-5'>
            <div className='ml-15' >
              <TiltCard image={sampleProduct.image} alt={sampleProduct.alt} />
            </div>
            <div>
              <ImgCard image={sampleStartup.image} alt={sampleStartup.alt} />
            </div>
          </div>
        </div>
        <div className='w-[36%]'>
          <div className='items-center'>
            <h1 className='text-3xl font-medium text-white text-center mt-7' style={{fontFamily:'poppins'}}>Trending Products</h1>
            <div className="min-h-[270px] overflow-x-auto hide-scrollbar scroll-smooth m-2 pt-5 mt-5">
              <div className="flex w-max px-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="origin-center"
                >
                  <div>
                    <ProductCardHome 
                      image="/camera1.png" 
                      productName="Visionary Camera X1" 
                      startupName="VisionaryCam" 
                      price="15999" 
                      rating={4.7}
                    />
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="origin-center"
                >
                  <div>
                    <ProductCardHome 
                      image="/hoodie.png.png" 
                      productName="ComfyWear Hoodie" 
                      startupName="UrbanStyle" 
                      price="1499" 
                      rating={4.6}
                    />
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="origin-center"
                >
                  <div>
                    <ProductCardHome 
                      image="/sneakers.png" 
                      productName="AirFlex Sneakers" 
                      startupName="StepUp" 
                      price="4999" 
                      rating={4.8}
                    />
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="origin-center"
                >
                  <div>
                    <ProductCardHome 
                      image="/Smartwatch.png" 
                      productName="ChronoFit Smartwatch" 
                      startupName="FitTech" 
                      price="12499" 
                      rating={4.5}
                    />
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="origin-center"
                >
                  <div>
                    <ProductCardHome 
                      image="/filter.png" 
                      productName="Smart Water Purifier" 
                      startupName="FitTech" 
                      price="9999" 
                      rating={4.4}
                      imgClassName="w-36 h-36"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <div className='items-center'>
            <h1 className='text-3xl font-medium text-white text-center mt-2' style={{fontFamily:'poppins'}}>Trending Startups</h1>
            <div className="h-60 overflow-x-auto hide-scrollbar scroll-smooth m-2 pt-5 mt-5">
              <div className="flex w-max px-2 gap-4">
                {[
                  { image: '/factory.png', name: 'FactoryWorks', rating: 4.8 },
                  { image: '/lorem.png', name: 'Lorem Innovations', rating: 4.6 },
                  { image: '/loremism.png', name: 'Loremism Tech', rating: 4.7 },
                  { image: '/man.png', name: 'Mantra Labs', rating: 4.5 },
                  { image: '/plogo.png', name: 'Pioneer Solutions', rating: 4.9 },
                ].map((startup, i) => (
                  <motion.div
                    key={startup.name}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="origin-center"
                  >
                    <ItemCard image={startup.image} name={startup.name} rating={startup.rating} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Discover