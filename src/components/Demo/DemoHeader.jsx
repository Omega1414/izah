import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nav } from "../../data";
import Auth from "./Auth/Auth";
import { Blog } from "../../Context/Context";
import { FaLightbulb } from "react-icons/fa";
import { IoMdMoon } from "react-icons/io";

const DemoHeader = () => {
  const [isActive, setIsActive] = useState(false);
  const { authModel, setAuthModel } = Blog();

  useEffect(() => {
    const scrollMe = () => {
      window.scrollY > 50 ? setIsActive(true) : setIsActive(false);
    };
    window.addEventListener("scroll", scrollMe);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle light/dark mode and update the HTML class
  const toggleMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Save the mode in localStorage
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
  };

  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode) {
      setIsDarkMode(storedMode === 'true');
    }
  }, []);  // Only run this once when the component mounts

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header
  className={`border-b border-black sticky dark:text-darkText top-0 z-50 
  ${isActive ? "bg-gray-200 dark:bg-gray-700" : "bg-white dark:bg-[#202124]"}
  transition-all duration-500 relative`}
>
  <div className="h-[70px] flex items-center justify-between px-5 relative z-10">
    {/* Logo */}
    <Link to={"/"}>
      <span className="text-5xl">
        <img
         
          className="w-[5rem] h-[3rem] object-contain cursor-pointer"
          src={"/black.png"}
          alt="logo"
        />
      </span>
    </Link>

    {/* Right side content */}
    <div className="flex items-center gap-5">
      <div className="hidden text-sm sm:flex items-center gap-5 relative z-10">
        {nav.map((link, i) => (
          <Link key={i} to={link.path}>
            {link.title}
          </Link>
        ))}
      </div>
      <div className="relative z-10">
        <button
          onClick={() => setAuthModel(true)}
          className="hidden text-sm sm:flex items-center gap-5"
        >
          Sign In
        </button>
        <Auth modal={authModel} setModal={setAuthModel} />
      </div>
      <button
        onClick={() => setAuthModel(true)}
        className={`text-white rounded-full px-3 p-2 text-sm font-medium 
        ${isActive ? "bg-green-700" : "bg-black"}`}
      >
        Get Started
      </button>
    </div>
  </div>

  {/* Light/Dark Mode Toggle in Center */}
  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-0">
    {/* Container for the mode toggle and labels */}
    <div className="flex items-center gap-4">
      {/* Light Mode Label */}
      <span className="hidden md:flex text-sm text-gray-700 dark:text-white">İşıqlı</span>

      {/* Mode switcher */}
      <div
        className={`relative w-16 h-8 flex items-center dark:bg-gray-600 rounded-full p-1 cursor-pointer 
        transition-colors border-2 dark:border-gray-300  ${isActive ? "bg-gray-300 border-gray-400" : "border-gray-300 bg-gray-200"}`}
        onClick={toggleMode}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${isDarkMode ? 'translate-x-8' : ''}`}
        />
        <FaLightbulb
          className={`text-xl text-yellow-500 absolute left-1 transition-opacity duration-300 ${
            isDarkMode ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ top: '50%', transform: 'translateY(-50%)' }} // Center the icon vertically
        />
        <IoMdMoon
          className={`text-xl text-gray-700 absolute right-1 transition-opacity duration-300 ${
            isDarkMode ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ top: '50%', transform: 'translateY(-50%)' }} // Center the icon vertically
        />
      </div>

      {/* Dark Mode Label */}
      <span className="hidden md:flex text-sm text-gray-700 dark:text-white">Qaranlıq</span>
    </div>
  </div>
</header>

  );
};

export default DemoHeader;
