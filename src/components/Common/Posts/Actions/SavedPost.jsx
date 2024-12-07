import React, { useEffect, useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { Blog } from "../../../../Context/Context";
import { deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";
import useSingleFetch from "../../../hooks/useSingleFetch";

const SavedPost = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { currentUser, setAuthModel } = Blog();
  const { data } = useSingleFetch("users", post?.userId, "savePost");

  // Check if the post is saved whenever the component mounts or when data changes
  useEffect(() => {
    const checkIfPostIsSaved = async () => {
      if (currentUser && post?.id) {
        const saveRef = doc(db, "users", currentUser?.uid, "savePost", post?.id);
        const docSnapshot = await getDoc(saveRef);

        // Set the isSaved state based on whether the document exists
        if (docSnapshot.exists()) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      }
    };

    checkIfPostIsSaved();
  }, [currentUser, post?.id]);

  const handleSave = async () => {
    try {
      if (currentUser) {
        const saveRef = doc(db, "users", currentUser?.uid, "savePost", post?.id);

        if (isSaved) {
          await deleteDoc(saveRef);
          setIsSaved(false); // Immediately update state
          toast.success("Paylaşım silindi");
        } else {
          await setDoc(saveRef, { ...post });
          setIsSaved(true); // Immediately update state
          toast.success("Paylaşım əlavə olundu");
        }
      } else {
        setAuthModel(true); // Trigger auth modal if user is not logged in
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSave} className="hover:opacity-60">
        <CiSaveDown2
          className={`text-2xl pointer-event-none ${isSaved ? "text-yellow-600" : ""}`}
        />
      </button>
    </div>
  );
};

export default SavedPost;
