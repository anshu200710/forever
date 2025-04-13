import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (isMobile && !newIsMobile) {
        setProfileDropdownOpen(false); // Reset dropdown state when switching to desktop
      }
      setIsMobile(newIsMobile);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    setToken('');
    setCartItems({});
  };

  const handleProfileClick = () => {
    if (token) {
      if (isMobile) {
        setProfileDropdownOpen(!profileDropdownOpen);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img className="w-36" src={assets.logo} alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1 ">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1 ">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1 ">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1 ">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <Link onClick={() => navigate('/search')}>
          <img onClick={() => setShowSearch(true)} className="w-5 cursor-pointer" src={assets.search_icon} alt="" />
        </Link>

        <div className="relative group">
          <img onClick={handleProfileClick} className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
          {/* ----- Drop Down */}
          {token && (
            <div
              className={`${
                (isMobile ? (profileDropdownOpen ? 'block' : 'hidden') : 'hidden group-hover:block')
              } absolute drop-shadow-menu right-0 pt-2`}
            >
              <div className="flex flex-col gap-2 w-36 px-5 bg-slate-100 text-gray rounded ">
                <p className="cursor-pointer hover:text-black ">My Profile</p>
                <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black ">
                  Orders
                </p>
                <p onClick={() => logout()} className="cursor-pointer hover:text-black ">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img className="w-5 min-w-5" src={assets.cart_icon} alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img onClick={() => setVisible(true)} className="w-5 cursor-pointer sm:hidden" src={assets.menu_icon} alt="" />
      </div>

      {/* Sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? 'w-full ' : 'w-0'
        } `}
      >
        <div className="flex flex-col text-gray-600">
          <div className="flex items-center gap-4 p-3 cursor-pointer">
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p onClick={() => setVisible(false)}>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            CONTACT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/adminpanel">
            ADMIN PANEL
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;