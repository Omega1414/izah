import React, { useState, useRef, useEffect } from "react";
import Preview from "./Preview";
import { Blog } from "../../../Context/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebase";

const Write = () => {
  const [content, setContent] = useState("<p></p>");
  const [title, setTitle] = useState("");
  const { publish, setPublish } = Blog();
  const editorRef = useRef(null); // Ref to the contentEditable area for descriptions
  const addImageButtonRef = useRef(null); // Ref for the + button

  // Insert image at the current cursor position
  const insertImage = (image) => {
    const storageRef = ref(storage, `images/${image.name}`);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0); // Get the current selection range

        // Create the image element
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Inserted Image";
        img.style.maxWidth = "100%";
        img.style.cursor = "move"; // Make image draggable

        // Allow dragging the image
        img.setAttribute("draggable", "true");
        img.ondragstart = (e) => {
          e.dataTransfer.setData("text", e.target.src);
        };

        // Insert the image at the cursor position
        range.deleteContents(); // Remove any selected text (if any)
        range.insertNode(img);

        // Move the cursor after the inserted image
        const newRange = document.createRange();
        newRange.setStartAfter(img); // Move the cursor after the image
        newRange.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(newRange);

        // Update content state
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

  // Handle double-click event to remove images
  const handleDoubleClick = (event) => {
    if (event.target.tagName === "IMG") {
      const imgContainer = event.target.parentElement;
      if (imgContainer) {
        imgContainer.remove();
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
