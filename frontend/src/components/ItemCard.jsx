import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ image, name, rating }) => {
  const navigate = useNavigate();
  const urlPath = `/startups/${name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className='h-60 w-48 bg-teal-800 rounded-xl flex flex-col items-center justify-center p-4 gap-2 cursor-pointer transition-shadow hover:shadow-2xl'
      onClick={() => navigate(urlPath)}
    >
      <div className="w-28 h-28 flex items-center justify-center overflow-visible">
        <img
          src={image}
          alt={name}
          className='w-28 h-28 object-contain rounded mb-1 drop-shadow transition-transform duration-300 hover:scale-110'
          style={{ pointerEvents: 'none' }}
        />
      </div>
      <span className='text-base font-bold text-white text-center break-words max-w-full'>{name}</span>
      <span className='text-xs text-yellow-200 flex items-center gap-1'>
        {'★'.repeat(Math.floor(rating))}
        {rating % 1 !== 0 ? '½' : ''}
        <span className='ml-1 text-cyan-100'>({rating})</span>
      </span>
    </div>
  );
};

export default ItemCard; 