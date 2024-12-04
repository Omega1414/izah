import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import { toast } from "react-toastify";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import useSingleFetch from "../../hooks/useSingleFetch";
import Loading from "../../Loading/Loading";
import Comment from "./Comment";

const Comments = ({ postId }) => {
  const { currentUser, allUsers, setCommentLength } = Blog();
  const [comment, setComment] = useState("");

  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);

  const { data, loading } = useSingleFetch("posts", postId, "comments");

  const writeComment = async () => {
    try {
      if (comment === "") {
        toast.error("Comment cannot be empty");
        return;
      }

      const commentRef = collection(db, "posts", postId, "comments");

      // Get the post owner ID, title, and timestamp
      const postDocRef = doc(db, "posts", postId);
      const postDocSnap = await getDoc(postDocRef);
      const postOwnerId = postDocSnap.data()?.userId; // Get the post owner ID
      const postTitle = postDocSnap.data()?.title; // Get the post title

      const timestamp = new Date();

      // Add the comment to Firestore
      await addDoc(commentRef, {
        commentText: comment,
        created: Date.now(),
        userId: currentUser?.uid,
      });

      // Check if the post owner is the current user
      if (postOwnerId !== currentUser?.uid) {
        // Only send a notification if the post owner is not the current user
        const notificationId = `${postId}-comment-${timestamp.getTime()}`;

        // Create a notification for the post owner
        await setDoc(doc(db, "notifications", notificationId), {
          postId,
          type: "comment",  // Type is 'comment'
          userId: currentUser?.uid,
          postOwnerId,
          timestamp,
          message: `"${postTitle}" paylaşımına yeni rəy yazıldı`,
        });
      }

      toast.success("Comment added successfully");
      setComment(""); // Clear the comment input field
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (data) {
      setCommentLength(data.length);
    }
  }, [data]);

  return (
    <div className="mt-8 w-full p-2 md:w-[60%] lg:w-[40%] items-center justify-center mx-auto  m-4">
      {/* Comment input form */}
      {currentUser && (
        <div className="p-3 my-5 ">
        <div className="border border-gray-400 dark:border-gray-600 p-5">
          <div className="flex items-center gap-2 mb-5 ">
            <img
              className="w-[2rem] h-[2rem] object-cover rounded-full"
              src={getUserData?.userImg || "/profile.jpg"}
              alt="user-img"
            />
            <h3 className="capitalize text-sm">{getUserData?.username}</h3>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bu paylaşım barədə fikirləriniz nədir?"
            className="w-full outline-none resize-none text-sm  dark:bg-darkBg px-2 pt-4 border border-gray-400 dark:border-gray-600"
          ></textarea>
        
          <div className="flex items-center justify-end gap-4 mt-[1rem]">
            <button onClick={() => setComment("")} className="text-sm">
              Ləğv et
            </button>
            <button
              onClick={writeComment}
              className="btn !text-xs !bg-green-700 !text-white !rounded-full"
            >
              Göndər
            </button>
          </div>
          </div>
        </div>
      )}

      {/* Displaying the comments */}
      {loading ? (
        <Loading />
      ) : (
        <div className="py-4 mt-8 flex flex-col gap-8">
          {data &&  (
            data.map((item, i) => (
              <Comment item={item} postId={postId} key={i} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
