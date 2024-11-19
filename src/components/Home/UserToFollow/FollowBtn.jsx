import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import useSingleFetch from "../../hooks/useSingleFetch";
import { useLocation } from "react-router-dom";

const FollowBtn = ({ userId }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { currentUser } = Blog();

  const { data, loading } = useSingleFetch(
    "users",
    currentUser?.uid,
    "follows"
  );

  useEffect(() => {
    setIsFollowed(data && data?.findIndex((item) => item.id === userId) !== -1);
  }, [data]);

  const handleFollow = async () => {
    try {
      if (currentUser) {
        const followRef = doc(db, "users", currentUser?.uid, "follows", userId);
        const followerRef = doc(db, "users", userId, "followers", currentUser?.uid);
        
        if (isFollowed) {
          // Unfollow user
          await deleteDoc(followRef);
          await deleteDoc(followerRef);
          toast.success("User is unFollowed");
        } else {
          // Follow user
          await setDoc(followRef, { userId: userId });
          await setDoc(followerRef, { userId: currentUser?.uid });
  
          // Create a notification for the user who has been followed
          const notificationRef = doc(db, "notifications", userId + "_" + currentUser?.uid); // Unique ID for the notification
          await setDoc(notificationRef, {
            type: "new_follower",
            message: "You have new follower!",
            timestamp: new Date(),
            postOwnerId: userId, // The user who is being followed
            followerId: currentUser?.uid, // The user who is following
            read: false,
          });
  
          toast.success("User is Followed");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { pathname } = useLocation();

  return (
    <>
      <button
        onClick={handleFollow}
        className={`${
          pathname === "/" ? "border border-black" : ""
        } px-3 py-[0.2rem] rounded-full
        ${isFollowed ? "text-gray-500 border-none" : ""}`}>
        {isFollowed ? "Following" : "Follow"}
      </button>
    </>
  );
};

export default FollowBtn;