import React, { useState, useRef, useEffect } from "react";
import Preview from "./Preview"; // Assuming Preview is still necessary
import { Blog } from "../../../Context/Context"; // Assuming Context for publish state
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebase";

const Write = () => {
  const [content, setContent] = useState("<p></p>");
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false); // State for focus
  const { publish, setPublish } = Blog();
  const editorRef = useRef(null);
  const addImageButtonRef = useRef(null); // Ref for the + button

  // Insert image at the current cursor position
  const insertImage = (image) => {
    const storageRef = ref(storage, `images/${image.name}`);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const editor = editorRef.current;
        
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

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(imgContainer);

        range.setStartAfter(imgContainer);
        range.setEndAfter(imgContainer);
        selection.removeAllRanges();
        selection.addRange(range);

        setContent(editor.innerHTML); // Update content after image is inserted
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

  // Track focus state for the editor and handle blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    // Don't trigger blur if the focus moves to the + button
    if (addImageButtonRef.current && addImageButtonRef.current.contains(e.relatedTarget)) {
      return;
    }
    setIsFocused(false);
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

    // Clean up event listener when the component is unmounted
    return () => {
      editor.removeEventListener("dblclick", handleDoubleClick);
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
    <section className="write-container">
      <input
        type="text"
        placeholder="Başlıq əlavə edin..."
        className="text-4xl outline-none w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onClick={() => setIsFocused(false)}
      />
      <div
        ref={editorRef}
        contentEditable
        className="content-editable my-5 p-5 border border-gray-300"
        dangerouslySetInnerHTML={{ __html: content }}
        placeholder="Start writing here..."
        onFocus={handleFocus}
        onBlur={handleBlur} // Handle blur manually
      />
      <button
        ref={addImageButtonRef}
        onClick={handleInsertImage}
        className="add-image-btn"
        disabled={!isFocused}  // Disable button if editor is not focused
      >
        +
      </button>

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
