import React, { useEffect, useState } from "react";
import { PiHandsClappingDuotone } from "react-icons/pi";
import { Blog } from "../../../../Context/Context";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";
import useSingleFetch from "../../../hooks/useSingleFetch";
import { formatNum } from "../../../../utils/helper";

const Like = ({ postId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser, setAuthModel } = Blog();

  const { data } = useSingleFetch("posts", postId, "likes");

  useEffect(() => {
    setIsLiked(
      data && data.findIndex((item) => item.id === currentUser?.uid) !== -1
    );
  }, [data]);

  const handleLike = async () => {
    try {
      if (currentUser) {
        const likeRef = doc(db, "posts", postId, "likes", currentUser?.uid);
  
        // Get the post owner ID, title, and timestamp
        const postDocRef = doc(db, "posts", postId);
        const postDocSnap = await getDoc(postDocRef);
        const postOwnerId = postDocSnap.data()?.userId; // Get the post owner ID
        const postTitle = postDocSnap.data()?.title; // Get the post title
  
        const timestamp = new Date();
  
        // If the current user is the post owner, do not create a notification for their own like
        if (currentUser.uid !== postOwnerId) {
          // Create a notification for the post owner if they are not the one who liked the post
          await setDoc(doc(db, "notifications", postId), {
            postId,
            type: "like",
            userId: currentUser?.uid,  // The user who liked the post
            postOwnerId,  // The actual post owner who will receive the notification
            timestamp,  // Timestamp of the like
            message: `"${postTitle} paylaşımı bəyənildi"`,
          });
        }
  
        if (isLiked) {
          // Delete the like if it's already liked
          await deleteDoc(likeRef);
        } else {
          // Set the like in the database
          await setDoc(likeRef, {
            userId: currentUser?.uid,
          });
        }
      } else {
        setAuthModel(true); // Show login prompt if user is not logged in
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <button onClick={handleLike} className="flex items-center gap-1 text-sm">
      <PiHandsClappingDuotone
        className={`text-xl ${isLiked ? "text-black dark:text-blue-400" : "text-gray-500 dark:text-blue-300"}`}
      />
      <span className="text-gray-500 dark:text-blue-300">{formatNum(data?.length)}</span>
    </button>
  );
};

export default Like;
