import React, { useEffect, useRef, useState } from 'react'
import { IoMdMoon, IoMdNotificationsOutline, IoMdSunny } from 'react-icons/io'
import { RxPencil2 } from "react-icons/rx";
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from './Search'
import Modal from '../../../utils/Modal'
import UserModal from './UserModal'
import { CiSearch } from 'react-icons/ci'
import { Blog } from '../../../Context/Context'
import Loading from '../../Loading/Loading'
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where, writeBatch} from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { toast } from 'react-toastify'
import { FaLightbulb } from 'react-icons/fa';
import Preview from '../Write/Preview';

const HomeHeader = () => {
  const { allUsers, userLoading, currentUser, setPublish, publish, title, description } = Blog()
  const [modal, setModal] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);  // Track the count of unread notifications
  const [searchModal, setSearchModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const getUserData = allUsers.find((user) => user.id === currentUser?.uid)
  const { pathname } = useLocation()
  const editPath = pathname.split("/")[1]
  const postId = pathname.split("/")[2]
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null); 
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(5); 
  const handleEdit = async () => {
    try {
      setLoading(true)
      const ref = doc(db, "posts", postId)
      await updateDoc(ref, {
        title,
        desc: description,
      })
      navigate(`/post/${postId}`)
      toast.success("Updated")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      const notificationsRef = query(
        collection(db, 'notifications'),
        where('postOwnerId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort notifications by timestamp (newest first)
        newNotifications.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        setNotifications(newNotifications);

        // Calculate unread notifications count
        const unread = newNotifications.filter((notification) => !notification.read).length;
        setUnreadCount(unread);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      // Mark all notifications as read when the dropdown is opened
      markNotificationsAsRead();
    }
  };

  const markNotificationsAsRead = async () => {
    if (notifications.length > 0) {
      // Create a batch instance
      const batch = writeBatch(db);
  
      notifications.forEach((notification) => {
        if (!notification.read) {
          const notificationRef = doc(db, 'notifications', notification.id);
          batch.update(notificationRef, { read: true });
        }
      });
  
      // Commit the batch update
      await batch.commit();
  
      // After marking as read, reset the unread count to 0
      setUnreadCount(0);  // Reset unread count to zero after marking as read
    }
  };

  const handleNotificationClick = async (postId, notificationId) => {
    if (!notificationId) {
      console.error('Notification ID is missing or undefined.');
      return;
    }

    const notificationRef = doc(db, 'notifications', notificationId);

    try {
      await updateDoc(notificationRef, { read: true });

      // Navigate to the post
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        navigate(`/post/${postId}`);
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }

    // Close dropdown after clicking a notification
    setIsDropdownOpen(false);
  };

  const loadMoreNotifications = () => {
    setVisibleNotifications((prev) => prev + 5); // Load 5 more notifications
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown and the button
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !dropdownButtonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when component is unmounted or dropdown ref changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const clearNotifications = async () => {
    if (currentUser) {
      try {
        // Show confirmation prompt (optional)
        const confirmClear = window.confirm("Are you sure you want to clear all notifications?");
        if (!confirmClear) return;
  
        // Query all notifications for the current user
        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, where("postOwnerId", "==", currentUser.uid));
  
        // Get all notifications for the user
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const batch = writeBatch(db);
  
          // Delete each notification in the batch
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
  
          // Commit the batch
          await batch.commit();
  
          // Update the state (optional)
          setNotifications([]);
          toast.success("All notifications cleared.");
        } else {
          toast.info("No notifications to clear.");
        }
      } catch (error) {
        toast.error("Error clearing notifications: " + error.message);
      }
    }
  };
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
    <header className='border-b border-gray-200 dark:border-gray-700 dark:bg-gray-600'>
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
          <span className="text-sm text-gray-700 dark:text-white">İşıqlı</span>

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
              className={`text-xl text-gray-300 absolute right-1 transition-opacity duration-300 ${
                isDarkMode ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ top: '50%', transform: 'translateY(-50%)' }} // Center the icon vertically
            />
          </div>

          {/* Dark Mode Name */}
          <span className="text-sm text-gray-700 dark:text-white">Qaranlıq</span>
        </div>

      
        <div className='flex items-center gap-3 sm:gap-7'>
          <span className='flex sm:hidden text-3xl text-gray-300 cursor-pointer ' onClick={() => setSearchModal(true)}>
            <CiSearch />
          </span>
          {pathname === "/" ? (
            <button onClick={() => setPublish(true)} className='btn !bg-green-700 !py-1 !text-white !rounded-full'>Paylaş</button>
          ) : editPath === "editPost" ? (
            <button onClick={handleEdit} className={`btn !bg-green-700 !py-1 !text-white !rounded-full ${loading ? "opacity-40" : ""}`}>
              {loading ? "Yenilənir..." : "Yadda saxla"}
            </button>
          ) : (
            <button onClick={() => setPublish(true)} className='hidden md:flex items-center gap-1 text-gray-500'>
              <span className='text-md dark:text-white  dark:hover:text-blue-300 transition-colors duration-200 flex ' >
             
            <RxPencil2  className='text-xl mr-1'/> Paylaş
              </span>
            </button>
          )}

          <div className="relative">
          <span
            ref={dropdownButtonRef}  // Attach ref to the notification icon button
            className="text-3xl text-gray-500 cursor-pointer dark:text-white"
            onClick={toggleDropdown}  // Toggle dropdown on click
          >
            <IoMdNotificationsOutline className="  dark:hover:fill-blue-300  transition-colors duration-200" />
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
              {unreadCount} {/* Display the unread notifications count */}
            </span>
          )}
          {isDropdownOpen && (
  <div
    ref={dropdownRef}  // Attach the ref to the dropdown
    className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50"
    style={{ maxHeight: '300px', overflowY: 'auto' }} // Make the dropdown scrollable
  >
    <ul>
      {notifications.length > 0 ? (
        notifications.slice(0, visibleNotifications).map((notification, index) => (
          <li
            key={index}
            className={`text-sm py-2 px-4 cursor-pointer ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}
            onClick={() => handleNotificationClick(notification.postId, notification.id)}
          >
            {notification.type === 'new_follower' ? (
              <strong>{notification.message}</strong>
            ) : (
              notification.message
            )}
            <br />
            <span className="text-xs text-gray-500">
              {new Date(notification.timestamp.seconds * 1000).toLocaleString()}
            </span>
          </li>
        ))
      ) : (
        <li className="text-sm text-gray-500 py-2 px-4">No new notifications</li>
      )}
    </ul>

    {/* Show "Show More" button if there are more notifications */}
    {notifications.length > visibleNotifications && (
      <button
        onClick={loadMoreNotifications}
        className="w-full text-center text-sm text-blue-500 py-2"
      >
        Show More
      </button>
    )}

    {/* Show the "Clear Notifications" button only if there are notifications */}
    {notifications.length > 0 && (
      <button
        onClick={clearNotifications}
        className="w-full text-center text-sm text-red-500 py-2"
      >
        Clear Notifications
      </button>
    )}
  </div>
)}
        </div>


          <div className='flex items-center relative'>
            <img
              onClick={() => setModal(true)}
              className='w-[2.3rem] h-[2.3rem] object-cover rounded-full cursor-pointer'
              src={getUserData?.userImg ? getUserData?.userImg : "/profile.jpg"} alt="profile-img" />
            <span onClick={() => setModal(true)} className='text-gray-500 cursor-pointer'>
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
     

       {publish && <Preview />}
    
    </header>
  )
}

export default HomeHeader
