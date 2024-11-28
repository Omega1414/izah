import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import useSingleFetch from "../../hooks/useSingleFetch";

const FollowBtn = ({ userId }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { currentUser, setAuthModel } = Blog(); // Blog context to get currentUser and setAuthModel

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
      if (!currentUser) {
        // If the user is not logged in, trigger the authentication model
        setAuthModel(true);
        return; // Stop further execution
      }

      const followRef = doc(db, "users", currentUser?.uid, "follows", userId);
      const followerRef = doc(db, "users", userId, "followers", currentUser?.uid);
        
      if (isFollowed) {
        // Unfollow user
        await deleteDoc(followRef);
        await deleteDoc(followerRef);
        toast.success("İzləməyi dayandırdınız");
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

        toast.success("Əlavə olundu");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  

  return (
    <>
      <button
        onClick={handleFollow}
        className={`px-2 py-1 text-sm rounded-full text-white font-semibold
        ${isFollowed ? "bg-gray-600" : " p-2 px-5  bg-blue-500 hover:bg-blue-600"}`}>
        {/* Apply blue background for follow, gray for unfollow */}
        {isFollowed ? "Dayandır" : "İzlə"}
      </button>
    </>
  );
};

export default FollowBtn;
