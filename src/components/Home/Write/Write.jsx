import React, { useState, useRef, useEffect } from "react";
import Preview from "./Preview"; // Assuming Preview is still necessary
import { Blog } from "../../../Context/Context"; // Assuming Context for publish state
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebase";

const Write = () => {
  const [content, setContent] = useState("<p></p>");
  const [title, setTitle] = useState("");
  const { publish, setPublish } = Blog();
  
  const editorRef = useRef(null); // Ref to the contentEditable area for descriptions
  const addImageButtonRef = useRef(null); // Ref for the + button
  const writeContainerRef = useRef(null); // Ref for the Write container

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

        // Update the content state
        setContent(editor.innerHTML); 
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

 

  // Add double-click event listener to remove images
  const handleDoubleClick = (event) => {
    if (event.target.tagName === "IMG") {
      const imgContainer = event.target.parentElement;
      if (imgContainer) {
        imgContainer.remove(); // Remove the image container
        setContent(editorRef.current.innerHTML); // Update content after image is removed
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

  // Detect click outside of the Write component to update the content state
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (writeContainerRef.current && !writeContainerRef.current.contains(e.target)) {
        // Clicked outside of the Write component, update the state
        const editor = editorRef.current;
        setContent(editor.innerHTML);
      }
    };

    // Add event listener to document
    document.addEventListener("click", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [content]);

  return (
    <section className="write-container" ref={writeContainerRef}>
      <input
        type="text"
        placeholder="Başlıq əlavə edin..."
        className="text-4xl outline-none w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div
        ref={editorRef}
        contentEditable
        className="content-editable my-5 p-5 border border-gray-300"
        dangerouslySetInnerHTML={{ __html: content }}
        placeholder="Start writing here..."
      />
      <button
        ref={addImageButtonRef}
        onClick={handleInsertImage}
        className="add-image-btn"
      >
        +
      </button>
      <span className="ml-2">Şəkillər əlavə etmək klikləyin. <br /><p className="mt-2"> Qeyd: Şəkili silmək üçün üzərinə 2 dəfə klikləyə bilərsiz.</p></span>
      <div
        className={`${
          publish ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-200`}>
        <Preview
          setPublish={setPublish}
          description={content}
          title={title}
        />
      </div>
    </section>
  );
};

export default Write;
