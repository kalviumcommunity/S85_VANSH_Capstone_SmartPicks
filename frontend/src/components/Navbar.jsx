import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="bg-teal-900 w-full py-2.5 shadow-sm border-b-1 border-b-white">
      <div className="flex items-center justify-between w-full px-4">

        {/* Logo - Left */}
        <div>
            <a href="/" className='cursor-pointer'>
                <img src="/SmartPicks-logo.png" alt="SmartPicks Logo" className="h-7" />
            </a>
        </div>

        {/* Navigation Links - Center */}
        <ul className="hidden md:flex gap-8 text-white font-medium text-sm" style={{fontFamily: 'poppins'}} >
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "> <a href="/Discover">Discover</a></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "> <a href="/Products"> Products</a></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "> <a href="/Startups"> Startups</a></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "><a href="/About">About</a></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "><a href="/Contact">Contact</a></li>
        </ul>

        {/* Right Side - Search + Icons */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <input
              type="text"
              placeholder="Search..."
              style={{fontFamily:'Poppins'}}
              className="text-sm bg-transparent outline-none text-black w-30 "
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600 ml-2 cursor-pointer" />
          </div>

          {/* Cart Icon */}
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-white text-lg cursor-pointer "
            />

          {/* Profile Icon */}
          <FontAwesomeIcon
            icon={faUser}
            className="text-white text-lg cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
