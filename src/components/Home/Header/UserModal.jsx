import React from 'react'
import { BiSpreadsheet } from 'react-icons/bi';
import { HiOutlineChartBar } from 'react-icons/hi';
import { LiaUserSolid } from 'react-icons/lia';
import { MdOutlineLocalLibrary } from 'react-icons/md';
import { Blog } from '../../../Context/Context';
import { Link, useNavigate } from 'react-router-dom';
import { secretEmail } from '../../../utils/helper';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { toast } from 'react-toastify';

const UserModal = (setModal) => {
    const {currentUser} = Blog()
    const navigate = useNavigate(null)
    const logout = async() => {
      try {
        await signOut(auth)
        navigate("/demo")
        toast.success("Hesabdan çıxdınız")
      } catch (error) {
        toast.error(message.error)
      }
    }
    const userModal = [
        {
          title: "Profile",
          icon: <LiaUserSolid />,
          path: `/profile/${currentUser?.uid}`,
        },
        {
          title: "Library",
          icon: <MdOutlineLocalLibrary />,
          path: "/library",
        },
        {
          title: "Stories",
          icon: <BiSpreadsheet />,
          path: "/stories",
        },
        {
          title: "Stats",
          icon: <HiOutlineChartBar />,
          path: "/stats",
        },
      ];
  return (
    <section className='absolute w-[18rem] p-6 bg-white dark:bg-darkBg dark:text-darkText right-0 top-[100%]  rounded-md z-50 text-gray-500'>
       
          <div className='flex flex-col gap-4 border-b border-gray-300 pb-5 '>
            {userModal.map((link, i) => (
                <Link 
                onClick={() => setModal(false)}
                className='flex items-center gap-2 text-gray-500 hover:text-black dark:text-darkText  hover:dark:text-gray-300' key={i} to={link.path}>
                    <span className='text-2xl'>{link.icon}</span>
                    <h2 className='text-md'>{link.title}</h2>
                </Link>
            ))}
          </div>
          <button onClick={logout} className='flex flex-col pt-5 cursor-pointer hover:text-black hover:dark:text-gray-300'>
            Hesabdan çıx
            <span className='text-sm'>{secretEmail(currentUser?.email)}</span>
          </button>
    </section>
  )
}

export default UserModal