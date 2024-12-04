import React, { useEffect, useRef, useState } from 'react'
import { Blog } from '../../../Context/Context';
import {IoMdNotificationsOutline } from 'react-icons/io'
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { toast } from 'react-toastify';
const Notifications = () => {
    const { currentUser } = Blog()
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null); 
    const [visibleNotifications, setVisibleNotifications] = useState(5); 
    const [unreadCount, setUnreadCount] = useState(0);  // Track the count of unread notifications
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        const confirmClear = window.confirm("Bütün bildirişləri silmək istədiyinizdən əminsiz?");
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
          toast.success("Bütün bildirişlər silindi");
        } else {
          toast.info("Bildiriş yoxdur");
        }
      } catch (error) {
        toast.error("Error clearing notifications: " + error.message);
      }
    }
  };
  
  return (
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
      ref={dropdownRef} // Attach the ref to the dropdown
      className="absolute right-0 mt-2 w-64 bg-white dark:bg-darkBg shadow-lg rounded-lg p-2 z-50"
      style={{
        maxHeight: '300px',  // Make the dropdown scrollable
        overflowY: 'auto',   // Ensure vertical scrolling
      }}
    >
<ul>
{notifications.length > 0 ? (
  notifications.slice(0, visibleNotifications).map((notification, index) => (
    <li
      key={index}
      className={`text-sm py-2 px-4 cursor-pointer ${notification.read ? 'text-gray-500 dark:text-gray-300' : 'text-gray-700 dark:text-darkText'}`}
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
  <li className="text-sm text-gray-500 py-2 px-4">Yeni bildiriş yoxdur</li>
)}
</ul>

{/* Show "Show More" button if there are more notifications */}
{notifications.length > visibleNotifications && (
<button
  onClick={loadMoreNotifications}
  className="w-full text-center text-sm text-blue-500 py-2"
>
  Daha çox göstər
</button>
)}

{/* Show the "Clear Notifications" button only if there are notifications */}
{notifications.length > 0 && (
<button
  onClick={clearNotifications}
  className="w-full text-center text-sm text-red-500 py-2"
>
  Bildirişləri sil
</button>
)}
</div>
)}
  </div>
  )
}

export default Notifications