import React, { useState, useEffect } from 'react';
import { LiaTimesSolid } from 'react-icons/lia';
import { Blog } from '../../../Context/Context';
import { db } from '../../../firebase/firebase';
import { deleteDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FollowingModal = ({ modal, setModal, follows }) => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [currentUserFollows, setCurrentUserFollows] = useState([]);
  const { allUsers, currentUser } = Blog();
  const navigate = useNavigate();

  // Fetch the current user's follows from Firestore
  useEffect(() => {
    const fetchCurrentUserFollows = async () => {
      try {
        const followsRef = collection(db, "users", currentUser?.uid, "follows");
        const querySnapshot = await getDocs(followsRef);
        const followsList = querySnapshot.docs.map(doc => doc.id);  // Get user IDs of the followed users
        setCurrentUserFollows(followsList);
      } catch (error) {
        console.error("Error fetching follows:", error);
      }
    };

    if (currentUser?.uid) {
      fetchCurrentUserFollows();
    }
  }, [currentUser]);

  // Fetch followed users based on the follows list passed to the modal
  useEffect(() => {
    if (follows?.length > 0) {
      const fetchFollowedUsers = follows.map(async (follow) => {
        const userData = allUsers.find(user => user.id === follow.id);
        return userData;  // Return the full user object
      });

      Promise.all(fetchFollowedUsers)
        .then((users) => {
          setFollowedUsers(users);
        })
        .catch((error) => console.error("Error fetching followed users:", error));
    }
  }, [follows, allUsers]);

  // Prevent the modal from closing when clicking inside it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Unfollow logic
  const handleUnfollow = async (userId) => {
    try {
      const followRef = doc(db, "users", currentUser?.uid, "follows", userId);
      const followerRef = doc(db, "users", userId, "followers", currentUser?.uid);
      await deleteDoc(followRef);  // Remove from the current user's following list
      await deleteDoc(followerRef);  // Remove from the followed user's followers list

      // Immediately update the UI after unfollowing
      setCurrentUserFollows(prevState => prevState.filter(id => id !== userId));

      toast.success("Unfollowed successfully");
    } catch (error) {
      toast.error("Error unfollowing the user");
    }
  };

  // Follow logic
  const handleFollow = async (userId) => {
    try {
      const followRef = doc(db, "users", currentUser?.uid, "follows", userId);
      const followerRef = doc(db, "users", userId, "followers", currentUser?.uid);
      await setDoc(followRef, { followedAt: new Date() });  // Add to the current user's following list
      await setDoc(followerRef, { followedAt: new Date() });  // Add to the followed user's followers list

      // Immediately update the UI after following
      setCurrentUserFollows(prevState => [...prevState, userId]);

      toast.success("Followed successfully");
    } catch (error) {
      toast.error("Error following the user");
    }
  };

  // Navigate to user profile
  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
    setModal(false); // Optionally close the modal when navigating
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ${modal ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}
      onClick={() => setModal(false)}  // Close modal when clicking outside
    >
      <div
        className="bg-white w-96 h-auto p-6 rounded-lg shadow-lg"
        onClick={handleModalClick}  // Prevent closing modal when clicking inside
      >
        <div className="flex justify-end mb-4">
          <button onClick={() => setModal(false)} className="text-gray-600">
            <LiaTimesSolid size={24} />
          </button>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Following</h3>
        {followedUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul>
          {followedUsers.map((user) => (
  // Check if the current user is the same as the viewed user
  <li
    key={`${user?.id}-${user?.username}`}  // Ensure unique key
    className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
    onClick={() => handleNavigateToProfile(user?.id)} // Navigate on click
  >
    <img
      src={user?.userImg || "https://www.pngitem.com/pimgs/m/4-40070_user-staff-man-profile-user-account-icon-jpg.png"}
      alt={user?.username}
      className="w-10 h-10 object-cover rounded-full"
    />
    <span>{user?.username}</span>

    {/* Check if the current user is following this user */}
    {currentUser?.uid !== user?.id && (
      // Only show Follow/Unfollow buttons if it's not the current user's own profile
      currentUserFollows.includes(user?.id) ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUnfollow(user?.id);
          }}
          className="ml-auto text-red-600 hover:text-red-800 text-sm"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFollow(user?.id);
          }}
          className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
        >
          Follow
        </button>
      )
    )}
  </li>
))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowingModal;
