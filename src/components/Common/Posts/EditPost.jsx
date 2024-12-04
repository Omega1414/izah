import React, { useState, useEffect, useRef } from "react";
import { Blog } from "../../../Context/Context";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import Loading from "../../Loading/Loading";

const EditPost = () => {
  const { postId } = useParams(); // Get the postId from URL params
  const { currentUser, setTitle, title, setDescription, description, updateData } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState(null); // To store post data
  const editorRef = useRef(null); // Ref to the contentEditable area for descriptions
  const addImageButtonRef = useRef(null); // Ref for the + button

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDescription(updateData.description);
    }
  }, [updateData]);

  useEffect(() => {
    // Fetch the post data by postId
    const fetchPostData = async () => {
      const postRef = doc(db, "posts", postId);
      try {
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost(postSnap.data());
        } else {
          toast.error("Nəticə tapılmadı");
        }
      } catch (error) {
        toast.error("Error fetching post data!");
      }
    };

    fetchPostData();
  }, [postId]);

  // Check if the current user is the owner of the post
  if (!currentUser) {
    // If the user is not logged in, redirect to the demo page or home
    return <Navigate to="/demo" replace />;
  }

  if (post && post.userId !== currentUser.uid) {
    // If the current user is not the post owner, redirect them to the post page
    return <Navigate to={`/post/${postId}`} replace />;
  }

  // Image insertion handler
  const insertImage = (image) => {
    const storageRef = ref(storage, `images/${image.name}`);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0); // Get the current selection range

        // Create a container for the image
        const imgContainer = document.createElement("div");
        imgContainer.style.position = "relative"; // Create a positioning context for the image

        const img = document.createElement("img");
        img.src = url;  // Use the uploaded image URL
        img.alt = "Inserted Image";
        img.style.maxWidth = "100%";
        img.style.margin = "20px 0";
        img.style.cursor = "pointer"; // Indicate that the image is interactive

        imgContainer.appendChild(img);

        // Insert the image at the current cursor position
        range.deleteContents(); // Delete any selected content before inserting the image
        range.insertNode(imgContainer); // Insert the image container where the cursor is

        // Create a new range to place the cursor after the inserted image
        const newRange = document.createRange();
        newRange.setStartAfter(imgContainer);
        newRange.setEndAfter(imgContainer);

        // Update the selection with the new range (keeps the cursor after the image)
        selection.removeAllRanges();
        selection.addRange(newRange);

        // Instead of updating description here, we'll do it on save
      });
    });
  };

  // Handle insert image button click
  const handleInsertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      if (e.target.files[0]) {
        insertImage(e.target.files[0]);
      }
    };
    input.click();
  };

  // Handle double-click for image removal
  const handleDoubleClick = (event) => {
    if (event.target.tagName === "IMG") {
      const imgContainer = event.target.parentElement;
      if (imgContainer) {
        imgContainer.remove(); // Remove the image container
        // Instead of updating description immediately, we'll update it on save
      }
    }
  };

  useEffect(() => {
    const editor = editorRef.current;

    // Add the double-click event listener for removing images
    editor.addEventListener("dblclick", handleDoubleClick);

    // Clean up event listeners when the component is unmounted
    return () => {
      editor.removeEventListener("dblclick", handleDoubleClick);
    };
  }, []);

  const handleEdit = async () => {
    try {
      setLoading(true)
      const ref = doc(db, "posts", postId);
      // Instead of using the editor directly, we get the description from the editorRef
      const editor = editorRef.current;
      const updatedDescription = editor.innerHTML;

      await updateDoc(ref, {
        title,
        desc: updatedDescription, // Save the updated description here
      });
      setDescription(updatedDescription); // Update description in state
      navigate(`/post/${postId}`);
      toast.success("Paylaşım yeniləndi");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <section className="write w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
    {loading && <Loading/>}
      <input
        type="text"
        placeholder="Title..."
        className="text-4xl outline-none w-full dark:bg-gray-500 border-2 border-gray-200 p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div
        ref={editorRef}
        contentEditable
        className="content-editable my-5 p-5 border border-gray-300 dark:text-darkText"
        placeholder="Start writing here..."
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <button
        ref={addImageButtonRef}
        onClick={handleInsertImage}
        className="add-image-btn"
      >
        +
      </button>
      <span className="ml-2 dark:text-darkText">Şəkil əlavə etmək üçün klikləyin <br />
      <p className="mt-2"> Şəkili silmək üçün şəkilin üzərinə iki dəfə klikləyin</p>
      </span>
      <div className="flex mx-auto items-center justify-center mt-8">
      <button
        onClick={handleEdit}
        className=" !bg-green-700 !py-2 px-5 !text-white !rounded-full  "
      >
        Yadda saxla
      </button>
      </div>
    </section>
  );
};

export default EditPost;

