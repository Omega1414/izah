import React, { useRef, useState } from 'react'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from './Search'
import Modal from '../../../utils/Modal'
import UserModal from './UserModal'
import { CiSearch } from 'react-icons/ci'
import { Blog } from '../../../Context/Context'
import Loading from '../../Loading/Loading'
import { FaLightbulb } from 'react-icons/fa';
import { LiaEditSolid } from 'react-icons/lia';
import Notifications from './Notifications'

const HomeHeader = () => {
  const { allUsers, userLoading, currentUser, setPublish, isDarkMode, setIsDarkMode } = Blog()
  const [modal, setModal] = useState(false)
  const [searchModal, setSearchModal] = useState(false)
  const getUserData = allUsers.find((user) => user.id === currentUser?.uid)
  const { pathname } = useLocation()
  const navigate = useNavigate();
  const editPath = pathname.split("/")[1];

 
  // Toggle light/dark mode and update the HTML class
  const toggleMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Save the mode in localStorage
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
  };
  
  return (
    <header className='border-b border-gray-200 dark:border-gray-700 dark:bg-gray-700 '>
      {userLoading && <Loading />}
      <div className='size h-[60px] flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link to="/">
            <span className='text-5xl'>
            <img
             onClick={() => navigate("/")}
              className='w-[5rem] h-[3rem] object-contain cursor-pointer'
              src={"/black.png"} alt="logo" />
            </span>
          </Link>
          <Search modal={searchModal} setModal={setSearchModal} />
        </div>
               {/* Light/Dark Mode Toggle */}
               <div className="flex items-center gap-4">
          {/* Mode names (Light on the left, Dark on the right) */}
          <span className="hidden lg:flex text-sm text-gray-700 dark:text-white">İşıqlı</span>

          {/* Mode switcher */}
          <div
            className="relative w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition-colors border-2 dark:border-gray-300 border-gray-200"
            onClick={toggleMode}
          >
            {/* Circle that moves */}
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${
                isDarkMode ? 'translate-x-8' : ''
              }`}
            />
            {/* Light mode icon */}
            <FaLightbulb
              className={`text-xl text-yellow-500 absolute left-1 transition-opacity duration-300 ${
                isDarkMode ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ top: '50%', transform: 'translateY(-50%)' }} // Center the icon vertically
            />
            {/* Dark mode icon */}
            <IoMdMoon
              className={`text-xl text-gray-700  absolute right-1 transition-opacity duration-300 ${
                isDarkMode ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ top: '50%', transform: 'translateY(-50%)' }} // Center the icon vertically
            />
          </div>
          {/* Dark Mode Name */}
          <span className="hidden lg:flex text-sm text-gray-700 dark:text-white">Qaranlıq</span>
        </div>
            
      
        <div className='flex items-center gap-3 sm:gap-7'>
          <span className='flex sm:hidden text-3xl text-gray-600 dark:text-white cursor-pointer ' onClick={() => setSearchModal(true)}>
            <CiSearch />
          </span>
          {pathname === "/write" ? (
            <button
              onClick={() => setPublish(true)}
              className="btn !bg-green-700 !py-1 !text-white !rounded-full">
              Davam et
            </button>
          ) : editPath === "editPost" ? (
            null
          ): (
            <Link
              to="/write"
              className="hidden lg:flex items-center gap-1 text-gray-500 dark:text-white justify-center dark:hover:text-blue-300 transition-colors duration-200">
              <span className="text-2xl mb-1">
                <LiaEditSolid />
              </span>
              <span className="text-md">Paylaş</span>
            </Link>
          )}

          <div>
              <Notifications />
            </div>

          <div className='flex items-center relative'>
            <img
              onClick={() => setModal(true)}
              className='w-[2.3rem] h-[2.3rem] object-cover rounded-full cursor-pointer'
              src={getUserData?.userImg ? getUserData?.userImg : "/profile.jpg"} alt="profile-img" />
            <span onClick={() => setModal(true)} className='text-gray-500 cursor-pointer dark:text-darkText'>
              <MdKeyboardArrowDown />
            </span>
            <Modal modal={modal} setModal={setModal}>
              <div className={`${modal ? "visible opacity-100%" : "invisible opacity-0"} transition-all duration-100`}>
                <UserModal setModal={setModal} />
              </div>
            </Modal>
          </div>

        </div>
      </div>

    </header>
  )
}

export default HomeHeader
