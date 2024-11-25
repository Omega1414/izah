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

        // Insert the image only inside the editorRef (description div)
        editor.appendChild(imgContainer);

        // After inserting the image, create a new empty line for the cursor
        const newLine = document.createElement("div");
        newLine.innerHTML = "<br>"; // This creates a line break, which places the cursor on a new line
        editor.appendChild(newLine);

        // Move the cursor to the new line
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(newLine); // Select the new line element
        range.collapse(false); // Move the cursor to the end of the new line
        selection.removeAllRanges();
        selection.addRange(range);

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

  const handleEditorChange = (event) => {
    setContent(event.target.innerHTML); // Update the content state directly on text changes
  };

  useEffect(() => {
    const editor = editorRef.current;

    // Add event listener to detect changes in the editor
    editor.addEventListener("input", handleEditorChange);

    // Clean up event listeners when the component is unmounted
    return () => {
      editor.removeEventListener("input", handleEditorChange);
    };
  }, []);

 

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

  // Handle click to insert an empty line below an image and move the cursor there (inside the description div)
 

  useEffect(() => {
    const editor = editorRef.current;

    // Add the double-click event listener for removing images
    editor.addEventListener("dblclick", handleDoubleClick);
   

    // Clean up event listeners when the component is unmounted
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
    <span className="ml-2">Şəkillər əlavə etmək klikləyin. Qeyd: Şəkili silmək üçün üzərinə 2 dəfə klikləyə bilərsiz.</span>
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
