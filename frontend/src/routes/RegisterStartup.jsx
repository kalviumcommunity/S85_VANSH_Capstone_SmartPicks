import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import Navbar from '../components/Navbar';

// Use environment variables or fallbacks
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://s85-vansh-capstone-smartpicks.onrender.com';
const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloudinary-cloud-name';
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

console.log('DEBUG: VITE_BACKEND_URL =', import.meta.env.VITE_BACKEND_URL);
console.log('DEBUG: Using backendUrl =', backendUrl);

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
      console.log('DEBUG: Starting registration process...');
      console.log('DEBUG: Form data:', data);
      
      const logoFile = data.StartupLogo[0];
      if (!logoFile) {
        console.log('DEBUG: No logo file found');
        setError('StartupLogo', { message: 'Logo file is required' });
        return;
      }
      console.log('DEBUG: Logo file found:', logoFile.name);

      console.log('DEBUG: Starting Cloudinary upload...');
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', logoFile);
      cloudinaryData.append('upload_preset', cloudinaryUploadPreset);

      console.log('DEBUG: Cloudinary URL:', `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`);
      console.log('DEBUG: Upload preset:', cloudinaryUploadPreset);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        cloudinaryData
      );

      console.log('DEBUG: Cloudinary upload successful:', cloudinaryRes.data);
      const logoUrl = cloudinaryRes.data.secure_url;

      const startupData = {
        ...data,
        StartupLogo: logoUrl,
      };
      
      console.log('DEBUG: Startup data to send:', startupData);
      console.log('DEBUG: Backend URL for registration:', `${backendUrl}/startups/register`);

      const response = await axios.post(
        `${backendUrl}/startups/register`,
        startupData,
        { headers: { } } // Explicitly send no Authorization header
      );

      console.log('DEBUG: Backend registration successful:', response.data);
      // Save token for later use (e.g., localStorage or context)
      localStorage.setItem('startupToken', response.data.token);

      console.log('Server response:', response.data);
      alert('Startup registered successfully!');
      reset();
    } catch (error) {
      console.error('DEBUG: Registration error details:', error);
      console.error('DEBUG: Error response:', error.response?.data);
      console.error('DEBUG: Error status:', error.response?.status);
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
