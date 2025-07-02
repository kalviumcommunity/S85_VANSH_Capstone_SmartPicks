// import React from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { FaRocket } from 'react-icons/fa';
// import Navbar from '../components/Navbar';

// const RegisterStartup = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     reset,
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const logoFile = data.StartupLogo[0];
//       if (!logoFile) {
//         setError('StartupLogo', { message: 'Logo file is required' });
//         return;
//       }

//       const cloudinaryData = new FormData();
//       cloudinaryData.append('file', logoFile);
//       cloudinaryData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//       const cloudinaryRes = await axios.post(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         cloudinaryData
//       );

//       const logoUrl = cloudinaryRes.data.secure_url;

//       const startupData = {
//         ...data,
//         StartupLogo: logoUrl,
//       };

//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/startups/register`,
//          startupData
//         );

//       console.log('Server response:', response.data);
//       alert('Startup registered successfully!');
//       reset();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       console.log("Cloud name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
//         console.log("Upload preset:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//       alert('Failed to register startup. Please try again.');
//     }
//   };

//   return (
//     <div className='flex flex-col'>
//         <Navbar/>
//         <div className="min-h-screen bg-gradient-to-br from-teal-900 to-teal-900 flex items-center justify-center px-4">
//         <motion.form
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             onSubmit={handleSubmit(onSubmit)}
//             className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-2xl space-y-8 border border-teal-100"
//         >
//             <div className="flex items-center justify-center gap-3">
//             <FaRocket className="text-teal-600 text-3xl" />
//             <h2 className="text-3xl font-bold text-teal-700 text-center">Register Your Startup</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//                 <input {...register('StartupName', { required: 'Startup Name is required' })} placeholder="Startup Name" className="input-field" />
//                 {errors.StartupName && <p className="text-red-500 text-sm mt-1">{errors.StartupName.message}</p>}
//             </div>

//             <div>
//                 <input {...register('StartupType', { required: 'Startup Type is required' })} placeholder="Startup Type" className="input-field" />
//                 {errors.StartupType && <p className="text-red-500 text-sm mt-1">{errors.StartupType.message}</p>}
//             </div>

//             <div>
//                 <input {...register('StartupEmail', { required: 'Email is required' })} placeholder="Startup Email" className="input-field" />
//                 {errors.StartupEmail && <p className="text-red-500 text-sm mt-1">{errors.StartupEmail.message}</p>}
//             </div>

//             <div>
//                 <input {...register('StartupPassword', { required: 'Password is required' })} type="password" placeholder="Password" className="input-field" />
//                 {errors.StartupPassword && <p className="text-red-500 text-sm mt-1">{errors.StartupPassword.message}</p>}
//             </div>

//             <div>
//                 <input {...register('StartupUSP')} placeholder="Unique Selling Proposition" className="input-field" />
//             </div>

//             <div>
//                 <input {...register('StartupOrigin')} placeholder="Startup Origin" className="input-field" />
//             </div>

//             <div>
//                 <input {...register('StartupFounderEmail')} placeholder="Founder Email" className="input-field" />
//             </div>

//             <div>
//                 <input {...register('StartupLogo', { required: 'Logo is required' })} type="file" className="input-field" />
//                 {errors.StartupLogo && <p className="text-red-500 text-sm mt-1">{errors.StartupLogo.message}</p>}
//             </div>

//             <div>
//                 <input {...register('StartupWebsiteLink')} placeholder="Website Link" className="input-field" />
//             </div>

//             <div>
//                 <input {...register('StartupInstaLink')} placeholder="Instagram Link" className="input-field" />
//             </div>
//             </div>

//             <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full bg-teal-600 text-white p-3 rounded-xl text-lg font-semibold shadow hover:bg-teal-700 transition"
//             >
//             🚀 Submit
//             </motion.button>
//         </motion.form>
//         </div>
//     </div>
//   );
// };

// export default RegisterStartup;
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const RegisterStartup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const logoFile = data.StartupLogo[0];
      if (!logoFile) {
        setError('StartupLogo', { message: 'Logo file is required' });
        return;
      }

      const cloudinaryData = new FormData();
      cloudinaryData.append('file', logoFile);
      cloudinaryData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        cloudinaryData
      );

      const logoUrl = cloudinaryRes.data.secure_url;

      const startupData = {
        ...data,
        StartupLogo: logoUrl,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/startups/register`,
        startupData
      );

      console.log('Server response:', response.data);
      alert('Startup registered successfully!');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to register startup. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-[#203a43] to-[#2c5364] text-white overflow-x-hidden">
      <Navbar />
      <div className="flex justify-center items-center min-h-[90vh] px-6">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-12 border border-white/20 text-white space-y-8"
        >
          <div className="flex items-center justify-center gap-3">
            <FaRocket className="text-teal-400 text-4xl animate-pulse" />
            <h2 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-300">Launch Your Startup</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'StartupName', placeholder: 'Startup Name', required: true },
              { name: 'StartupType', placeholder: 'Startup Type', required: true },
              { name: 'StartupEmail', placeholder: 'Startup Email', required: true },
              { name: 'StartupPassword', placeholder: 'Password', required: true, type: 'password' },
              { name: 'StartupUSP', placeholder: 'Unique Selling Proposition' },
              { name: 'StartupOrigin', placeholder: 'Startup Origin' },
              { name: 'StartupFounderEmail', placeholder: 'Founder Email' },
              { name: 'StartupWebsiteLink', placeholder: 'Website Link' },
              { name: 'StartupInstaLink', placeholder: 'Instagram Link' },
              { name: 'StartupLogo', placeholder: 'Upload Logo', required: true, type: 'file' }
            ].map(({ name, placeholder, type = 'text', required }) => (
              <div key={name}>
                <input
                  {...register(name, required ? { required: `${placeholder} is required` } : {})}
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white text-white transition duration-300"
                />
                {errors[name] && (
                  <p className="text-red-400 text-sm mt-1">{errors[name]?.message}</p>
                )}
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 py-3 rounded-xl text-lg font-bold shadow-lg transition-all"
          >
            🚀 Register Startup
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default RegisterStartup;
