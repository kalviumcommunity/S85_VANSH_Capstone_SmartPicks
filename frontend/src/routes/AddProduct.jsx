import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Navbar from '../components/Navbar';

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

//   const onSubmit = async (data) => {
//     setUploading(true);
//     const imageFile = data.productImage[0];
//     const formData = new FormData();
//     formData.append('file', imageFile);
//     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const { data: cloudRes } = await axios.post(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData
//       );
//       const prod = { ...data, productImage: cloudRes.secure_url };
//       await axios.post(
//   `${import.meta.env.VITE_BACKEND_URL}/products/addproduct`,
//   prod,
//   {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
//   }
// );

//       alert('Product added!');
//       reset(); setPreview('');
//     } catch {
//       alert('Error adding product');
//     } finally {
//       setUploading(false);
//     }
//   };

const onSubmit = async (data) => {
  setUploading(true);
  const imageFile = data.productImage[0];
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    const { data: cloudRes } = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    const prod = { ...data, productImage: cloudRes.secure_url };

    // 🔐 Get token from localStorage
    const token = localStorage.getItem('startupToken');

    if (!token) {
      alert('You must be logged in as a startup to add a product.');
      setUploading(false);
      return;
    }

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/products/addproduct`,
      prod,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert('Product added!');
    reset();
    setPreview('');
  } catch (error) {
    console.error('Error submitting product:', error);
    alert('Failed to add product.');
  } finally {
    setUploading(false);
  }
};


  const fields = [
    { name: 'productName', label: 'Product Name', type: 'text', required: true },
    { name: 'productCategory', label: 'Category', type: 'text', required: true },
    { name: 'stocks', label: 'Available Stocks', type: 'number', required: true },
    { name: 'color', label: 'Color', type: 'text' },
    { name: 'usp', label: 'Unique Selling Point', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-950 to-black text-white">
      <Navbar />

      <div className="flex flex-col md:flex-row gap-8 max-w-screen-xl mx-auto px-6 py-24">
        {/* Left Preview */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 50 }}
          className="md:w-1/2 flex justify-center items-center bg-black/30 backdrop-blur-lg rounded-xl border border-teal-700 p-6 shadow-xl"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-w-full max-h-[500px] rounded-lg" />
          ) : (
            <p className="text-gray-500 italic">Product preview appears here</p>
          )}
        </motion.div>

        {/* Right Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 50 }}
          className="md:w-1/2 bg-black/30 backdrop-blur-lg rounded-xl border border-teal-800 p-6 shadow-xl"
        >
          <motion.h1
            className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
          >
            🚀 Add New Product
          </motion.h1>

          {fields.map((field) => (
            <div key={field.name} className="relative mb-6">
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name, {
                    required: field.required && `${field.label} required`,
                  })}
                  rows={4}
                  placeholder=" "
                  className="peer w-full p-3 pt-6 rounded-md bg-black/20 border border-teal-700 text-white placeholder-transparent focus:outline-none focus:border-teal-500"
                />
              ) : (
                <input
                  type={field.type}
                  {...register(field.name, {
                    required: field.required && `${field.label} required`,
                  })}
                  placeholder=" "
                  className="peer w-full p-3 pt-6 rounded-md bg-black/20 border border-teal-700 text-white placeholder-transparent focus:outline-none focus:border-teal-500"
                />
              )}
              <label
                className={`absolute left-3 top-3 text-gray-400 text-sm transition-all duration-200
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                  peer-focus:top-3 peer-focus:text-sm peer-focus:text-teal-300
                  ${watch(field.name) ? 'top-3 text-sm text-teal-300' : ''}`}
              >
                {field.label}
              </label>
              {errors[field.name] && (
                <span className="text-red-400 text-sm">{errors[field.name].message}</span>
              )}
            </div>
          ))}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="flex flex-col items-center justify-center border-dashed border-2 border-teal-500 rounded-md p-5 cursor-pointer hover:bg-teal-800/10 transition">
              <AiOutlineCloudUpload className="text-4xl text-teal-400 mb-2" />
              <span className="text-teal-200">Upload Product Image</span>
              <input
                type="file"
                accept="image/*"
                {...register('productImage', {
                  required: 'Product image is required',
                  onChange: handlePreview,
                })}
                className="hidden"
              />
            </label>
            {errors.productImage && (
              <span className="text-red-400 text-sm">{errors.productImage.message}</span>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-300 hover:from-teal-600 hover:to-teal-400 text-black font-bold rounded-md transition"
            whileTap={{ scale: 0.95 }}
          >
            {uploading ? 'Uploading...' : 'Add Product'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}