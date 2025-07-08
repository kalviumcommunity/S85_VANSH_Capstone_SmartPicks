import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear the startup token
    localStorage.removeItem('startupToken');
    // Redirect to login page
    navigate('/login');
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('startupToken');

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
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "> <Link to="/Discover">Discover</Link></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "> <Link to="/Products"> Products</Link></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "> <Link to="/Startups"> Startups</Link></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "><Link to="/About">About</Link></li>
          <li className="cursor-pointer hover:scale-125 transition-all duration-200 "><Link to="/Contact">Contact</Link></li>
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
          <Link to="/profile" >
          <FontAwesomeIcon
            icon={faUser}
            className="text-white text-lg cursor-pointer"
            />
            </Link>

          {/* Logout Button - Only show if logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-red-300 transition-colors duration-200"
              title="Logout"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="text-white text-lg cursor-pointer hover:text-red-300"
              />
              <span className="hidden md:inline text-sm font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
