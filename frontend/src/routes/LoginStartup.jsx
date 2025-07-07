import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log('DEBUG: VITE_BACKEND_URL =', backendUrl);
console.log('DEBUG: VITE_GOOGLE_CLIENT_ID =', googleClientId);

if (!backendUrl || !googleClientId) {
  return (
    <div style={{color: 'red', fontWeight: 'bold', padding: 40}}>
      ERROR: VITE_BACKEND_URL or VITE_GOOGLE_CLIENT_ID is not set.<br/>
      backendUrl: {String(backendUrl)}<br/>
      googleClientId: {String(googleClientId)}<br/>
      Please check your .env file and Netlify environment variables.<br/>
      (This message is visible in production if the build is missing these variables.)
    </div>
  );
}

const LoginStartup = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();

  // Email/Password login
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${backendUrl}/startups/login`,
        data
      );
      localStorage.setItem('startupToken', response.data.token);
      navigate('/profile');
    } catch (error) {
      setError('StartupEmail', { message: 'Invalid email or password' });
    }
  };

  // Google login success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const backendRes = await axios.post(
        `${backendUrl}/startups/google-login`,
        { credential: credentialResponse.credential }
      );
      localStorage.setItem('startupToken', backendRes.data.token);
      navigate('/profile');
    } catch (err) {
      alert('Google login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // Google login error handler
  const handleGoogleError = () => {
    alert('Google login failed.');
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1500&q=80"
            alt="Startup Background"
            className="w-full h-full object-cover object-center brightness-75 blur-sm"
          />
          {/* Animated gradient overlays */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/60 via-teal-800/40 to-indigo-900/60 mix-blend-multiply"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
          />
          {/* Floating animated shapes */}
          <motion.div
            className="absolute left-1/4 top-1/3 w-72 h-72 bg-cyan-400/30 rounded-full filter blur-2xl"
            animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-teal-300/20 rounded-full filter blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>

        {/* Glassmorphic Login Card */}
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          className="relative z-10 w-full max-w-md p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-2xl flex flex-col gap-8"
        >
          <motion.h2
            className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🚀 Startup Login
          </motion.h2>
          <motion.p
            className="text-center text-lg text-white/80 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome back! Log in to launch your next big idea.
          </motion.p>

          {/* Email/Password Login */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <motion.div
              whileFocus={{ scale: 1.03 }}
              className="flex flex-col gap-2"
            >
              <input
                {...register('StartupEmail', { required: 'Email is required' })}
                type="email"
                placeholder="Startup Email"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white text-white transition duration-300"
              />
              {errors.StartupEmail && (
                <p className="text-red-400 text-sm mt-1">{errors.StartupEmail.message}</p>
              )}
            </motion.div>
            <motion.div
              whileFocus={{ scale: 1.03 }}
              className="flex flex-col gap-2"
            >
              <input
                {...register('StartupPassword', { required: 'Password is required' })}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white text-white transition duration-300"
              />
              {errors.StartupPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.StartupPassword.message}</p>
              )}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 py-3 rounded-xl text-lg font-bold shadow-lg transition-all"
            >
              Login
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-white/30" />
            <span className="text-white/60 text-sm">or</span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          {/* Google Login Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex justify-center"
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="300"
              shape="pill"
              theme="filled_blue"
              text="continue_with"
              logo_alignment="center"
            />
          </motion.div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginStartup;
